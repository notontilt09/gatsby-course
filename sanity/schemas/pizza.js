import { MdLocalPizza as icon } from 'react-icons/md';
import PriceInput from '../components/PriceInput';

export default {
  // Computer Name
  name: 'pizza',
  // Visible title
  title: 'Pizzas',
  type: 'document',
  icon,
  fields: [
    {
      name: 'name',
      title: 'Pizza Name',
      type: 'string',
      description: 'Name of the pizza',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 100,
      },
    },
    {
      name: 'image',
      title: 'Image',
      type: 'image',
      options: {
        hotspot: true,
      },
    },
    {
      name: 'price',
      title: 'Price',
      type: 'number',
      description: 'Price of the pizza in cents',
      valdiation: (Rule) => Rule.min(1000).max(50000),
      inputComponent: PriceInput,
    },
    {
      name: 'toppings',
      title: 'Toppings',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'topping' }] }],
    },
  ],
  preview: {
    select: {
      title: 'name',
      media: 'image',
      topping0: 'toppings.0.name',
      topping0veg: 'toppings.0.vegetarian',
      topping1: 'toppings.1.name',
      topping1veg: 'toppings.1.vegetarian',
      topping2: 'toppings.2.name',
      topping2veg: 'toppings.2.vegetarian',
      topping3: 'toppings.3.name',
      topping3veg: 'toppings.3.vegetarian',
    },
    prepare: ({ title, media, ...toppings }) => {
      // 1. Filter undefined toppings out
      const vegPizza = Object.values(toppings).every((top) => top !== false);
      const tops = Object.values(toppings).filter((top) => Boolean(top) && top !== true);
      // 2. return the preview object for the pizza
      return {
        title: `${title} ${vegPizza ? '🌱' : ''}`,
        media,
        subtitle: Object.values(tops).join(', '),
      };
    },
  },
};
