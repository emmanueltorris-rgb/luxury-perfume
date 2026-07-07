from sqlalchemy.orm import Session
from backend.models.cart import Cart
from backend.models.cart_item import CartItem
from backend.models.product import Product


def get_cart(db:Session, user_id:int):
    return(
        db.query(Cart).filter(
            Cart.user_id == user_id
        ).first()
    )

def create_cart(db:Session, user_id: int):
    cart = Cart(user_id=user_id)
    db.add(cart)
    db.commit()
    db.refresh(cart)

    return cart

def add_to_cart(db:Session, user_id:int, product_id:int, quantity:int = 1):
    cart = get_cart(db,user_id)
    if not cart:
        cart = create_cart(db, user_id)
    cart_item = (db.query(CartItem).filter(
        CartItem.cart_id == cart.id,
        CartItem.product_id == product_id
    ).first()
    )
    if cart_item:
        cart_item.quantity += quantity
    else:
        cart_item = CartItem(
            cart_id=cart.id,
            product_id=product_id,
            quantity=quantity
        )
        db.add(cart_item)

    db.commit()
    db.refresh(cart_item)

    return cart_item

def get_cart_items(db:Session, user_id:int):
    cart = get_cart(db, user_id)
    if not cart:
        return[]
    return cart.items


def update_cart_item_quantity( db:Session, cart_item_id:int, quantity:int ):
    cart_item =( db.query(CartItem).filter(
        CartItem.id == cart_item_id
    ).first()
    )
    if not cart_item:
        return None
    cart_item.quantity = quantity
    db.commit()
    db.refresh(cart_item)

    return cart_item

def remove_from_cart(db:Session, cart_item_id:int):
    cart_item = (
        db.query(CartItem).filter(
            CartItem.id == cart_item_id
            ).first()
    )
    if not cart_item:
        return False
    db.delete(cart_item)
    db.commit()

    return True

def clear_cart(db:Session, user_id:int):
    cart = get_cart(db, user_id)
    if not cart:
        return
    
    db.query(CartItem).filter(
        CartItem.cart_id == cart.id
    ).delete()
    db.commit()

def delete_cart(db: Session, user_id: int):
    cart = get_cart(db, user_id)

    if not cart:
        return

    db.delete(cart)
    db.commit()
    