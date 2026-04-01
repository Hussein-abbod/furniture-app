from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from sqlalchemy import desc
from ..core.database import get_db
from ..core.security import get_current_user, get_current_admin
from ..models.user import User
from ..models.admin import Admin
from ..models.order import Order, OrderItem, OrderStatus
from ..models.cart import CartItem
from ..models.product import Product
from ..schemas.schemas import OrderResponse, CheckoutRequest

router = APIRouter(prefix="/api/orders", tags=["Orders"])

@router.get("", response_model=List[OrderResponse])
async def get_my_orders(current_user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    orders = db.query(Order).filter(Order.user_id == current_user.id).order_by(desc(Order.created_at)).all()
    return orders

@router.post("/checkout", response_model=OrderResponse)
async def checkout(
    req: CheckoutRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    cart_items = db.query(CartItem).filter(CartItem.user_id == current_user.id).all()
    if not cart_items:
        raise HTTPException(status_code=400, detail="Cart is empty")

    total_amount = 0.0
    for item in cart_items:
        if item.quantity > item.product.stock:
            raise HTTPException(status_code=400, detail=f"Not enough stock for {item.product.name}")
        total_amount += (item.product.price * item.quantity)
    
    new_order = Order(
        user_id=current_user.id,
        total_amount=total_amount,
        status=OrderStatus.pending
    )
    db.add(new_order)
    db.flush() # get id

    for c in cart_items:
        # Deduct stock and increment total_sold
        c.product.stock -= c.quantity
        
        c.product.total_sold = (c.product.total_sold or 0) + c.quantity

        order_item = OrderItem(
            order_id=new_order.id,
            product_id=c.product_id,
            quantity=c.quantity,
            unit_price=c.product.price,
            category=c.product.category
        )
        db.add(order_item)
        db.delete(c) # Clear from cart

    db.commit()
    db.refresh(new_order)
    return new_order

@router.get("/admin", response_model=List[OrderResponse])
async def get_all_orders(admin: Admin = Depends(get_current_admin), db: Session = Depends(get_db)):
    orders = db.query(Order).order_by(desc(Order.created_at)).all()
    return orders

from pydantic import BaseModel
class OrderStatusUpdate(BaseModel):
    status: str

@router.put("/admin/{order_id}/status", response_model=OrderResponse)
async def update_order_status(
    order_id: int, 
    update_data: OrderStatusUpdate,
    admin: Admin = Depends(get_current_admin), 
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    try:
        order.status = OrderStatus(update_data.status)
        db.commit()
        db.refresh(order)
        return order
    except ValueError:
        raise HTTPException(status_code=400, detail="Invalid status")

@router.get("/{order_id}", response_model=OrderResponse)
async def get_order_by_id(
    order_id: int, 
    current_user: User = Depends(get_current_user), 
    db: Session = Depends(get_db)
):
    order = db.query(Order).filter(Order.id == order_id).first()
    if not order:
        raise HTTPException(status_code=404, detail="Order not found")
    
    if order.user_id != current_user.id:
        # Wait, if admin needs to fetch by ID?
        # Actually /admin endpoint gets all data, so this is just user fetch.
        raise HTTPException(status_code=403, detail="Not authorized to view this order")

    return order
