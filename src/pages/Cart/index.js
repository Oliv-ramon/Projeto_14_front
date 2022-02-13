import { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import CartContext from "../../contexts/CartContext";
import AuthContext from "../../contexts/CartContext";
import api from "../../services/api"

import ItemElement from "./ItemElement";
import { BuyButton, CartContainer, Header } from "./style";

export default function Cart() {
  const { cartItens } = useContext(CartContext);
  const { auth } = useContext(AuthContext);
  const navigate = useNavigate();
  const total = calcTotal();

  function calcTotal() {
    if (cartItens.length === 0) return 0;
    
    const total = cartItens.reduce((cI, nI) => cI.price + nI.price);
    
    return total;
  }

  async function handlePurchase() {
    try {
      await api.postPurchase(cartItens, auth.token);
      await api.deleteCartItem( "all", auth.token);
      navigate("/successfull-purchase");
    } catch {
      alert("")
    }
  }

  useEffect(() => {
    if (!auth?.token) {
      navigate("/sign-in")
    }
  }, []);

  if (!cartItens.length > 0) {
    return (
      <CartContainer>
        <p>Seu carrinho está vazio, adicione itens para fechar o pedido!</p>
      </CartContainer>
    )
  }

  return (
    <CartContainer justify="flex-start">
      <h1>Total: R$ {total}</h1>
      <Header>
        <BuyButton
          onClick={handlePurchase}
        > 
          Fechar pedido
        </BuyButton>
      </Header>
      <ul>
        {cartItens.map(i => (
          <ItemElement 
            key={i._id}
            {...i}
          />
          ))}
      </ul>
      </CartContainer>
  )
}