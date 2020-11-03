import { graphql } from 'gatsby';
import React, { useState } from 'react';
import Img from 'gatsby-image';
import SEO from '../components/SEO';
import useForm from '../utils/useForm';
import calculatePizzaPrice from '../utils/calculatePizzaPrice';
import formatMoney from '../utils/formatMoney';
import OrderStyles from '../styles/OrderStyles';
import MenuItemsStyles from '../styles/MenuItemStyles';
import usePizza from '../utils/usePizza';
import PizzaOrder from '../components/PizzaOrder';
import calculateOrderTotal from '../utils/calculateOrderTotal';

export default function OrderPage({ data }) {
  const pizzas = data.pizzas.nodes;
  const { values, updateValue } = useForm({
    name: '',
    email: '',
    mapleSyrup: '',
  });
  const { order, addToOrder, removeFromOrder, error, loading, message, submitOrder } = usePizza({
    pizzas,
    values,
  });

  if (message) {
    return <p>{message}</p>;
  }
  return (
    <>
      <SEO title="Order A Pizza" />
      <OrderStyles onSubmit={submitOrder}>
        <fieldset disabled={loading}>
          <legend>Your Info</legend>
          <label htmlFor="name">
            Name
            <input type="text" name="name" id="name" value={values.name} onChange={updateValue} />
          </label>
          <label htmlFor="email">
            Email
            <input type="email" name="email" id="email" value={values.email} onChange={updateValue} />
            <input
              className="mapleSyrup"
              type="mapleSyrup"
              name="mapleSyrup"
              id="mapleSyrup"
              value={values.mapleSyrup}
              onChange={updateValue}
            />
          </label>
        </fieldset>
        <fieldset className="menu" disabled={loading}>
          <legend>Menu</legend>
          {pizzas.map((pizza) => (
            <MenuItemsStyles key={pizza.id}>
              <Img fluid={pizza.image.asset.fluid} width="50" height="50" alt={pizza.name} />
              <div>
                <h2>{pizza.name}</h2>
              </div>
              <div>
                {['S', 'M', 'L'].map((size) => (
                  <button onClick={() => addToOrder({ id: pizza.id, size })} key={size} type="button">
                    {size} {formatMoney(calculatePizzaPrice(pizza.price, size))}
                  </button>
                ))}
              </div>
            </MenuItemsStyles>
          ))}
        </fieldset>
        <fieldset className="order" disabled={loading}>
          <legend>Order</legend>
          <PizzaOrder order={order} removeFromOrder={removeFromOrder} pizzas={pizzas} />
        </fieldset>
        <fieldset disabled={loading}>
          <h3>Your Total is {formatMoney(calculateOrderTotal(order, pizzas))}</h3>
          <div>{error ? <p>Error: {error}</p> : ''}</div>
          <button type="submit" disabled={loading}>
            {loading ? 'Placing Order...' : 'Order Ahead'}
          </button>
        </fieldset>
      </OrderStyles>
    </>
  );
}

export const query = graphql`
  query {
    pizzas: allSanityPizza {
      nodes {
        name
        id
        slug {
          current
        }
        price
        image {
          asset {
            fluid(maxWidth: 100) {
              ...GatsbySanityImageFluid
            }
          }
        }
      }
    }
  }
`;
