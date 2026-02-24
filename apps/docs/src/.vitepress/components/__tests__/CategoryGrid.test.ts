import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CategoryGrid from '../CategoryGrid.vue';

const mockItems = [
  {
    id: 'item-1',
    title: 'Test Item 1',
    description: 'First test item for testing',
    tags: ['test', 'demo'],
    url: '/test/item-1',
  },
  {
    id: 'item-2',
    title: 'Another Item',
    description: 'Second test item',
    tags: ['example', 'sample'],
    url: '/test/item-2',
  },
  {
    id: 'item-3',
    title: 'Special Item',
    description: 'Item with special features',
    tags: ['special', 'featured'],
    url: '/test/item-3',
  },
];

describe('CategoryGrid', () => {
  it('should render with required props', () => {
    const wrapper = mount(CategoryGrid, {
      props: {
        items: mockItems,
        category: 'skills',
      },
    });

    expect(wrapper.exists()).toBe(true);
  });

  it('should display all items initially', () => {
    const wrapper = mount(CategoryGrid, {
      props: {
        items: mockItems,
        category: 'skills',
      },
    });

    const cards = wrapper.findAll('.grid-card');
    expect(cards.length).toBe(3);
  });

  it('should display category icon based on category prop', () => {
    const wrapper = mount(CategoryGrid, {
      props: {
        items: mockItems,
        category: 'skills',
      },
    });

    const icon = wrapper.find('.card-icon');
    expect(icon.text()).toBe('⚙️');
  });

  it('should filter items by title', async () => {
    const wrapper = mount(CategoryGrid, {
      props: {
        items: mockItems,
        category: 'skills',
      },
    });

    const input = wrapper.find('.grid-search-input');
    await input.setValue('Special');

    const cards = wrapper.findAll('.grid-card');
    expect(cards.length).toBe(1);
    expect(cards[0].text()).toContain('Special Item');
  });

  it('should filter items by description', async () => {
    const wrapper = mount(CategoryGrid, {
      props: {
        items: mockItems,
        category: 'skills',
      },
    });

    const input = wrapper.find('.grid-search-input');
    await input.setValue('special features');

    const cards = wrapper.findAll('.grid-card');
    expect(cards.length).toBe(1);
  });

  it('should filter items by tags', async () => {
    const wrapper = mount(CategoryGrid, {
      props: {
        items: mockItems,
        category: 'skills',
      },
    });

    const input = wrapper.find('.grid-search-input');
    await input.setValue('demo');

    const cards = wrapper.findAll('.grid-card');
    expect(cards.length).toBe(1);
    expect(cards[0].text()).toContain('Test Item 1');
  });

  it('should show empty state when no items match', async () => {
    const wrapper = mount(CategoryGrid, {
      props: {
        items: mockItems,
        category: 'skills',
      },
    });

    const input = wrapper.find('.grid-search-input');
    await input.setValue('nonexistent');

    expect(wrapper.find('.empty-state').exists()).toBe(true);
    expect(wrapper.find('.empty-state').text()).toContain('No items found');
  });

  it('should be case-insensitive in search', async () => {
    const wrapper = mount(CategoryGrid, {
      props: {
        items: mockItems,
        category: 'skills',
      },
    });

    const input = wrapper.find('.grid-search-input');
    await input.setValue('SPECIAL');

    const cards = wrapper.findAll('.grid-card');
    expect(cards.length).toBe(1);
  });

  it('should display tags with +N indicator for more than 3 tags', () => {
    const itemWithManyTags = {
      id: 'item-4',
      title: 'Item with many tags',
      description: 'Test item',
      tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5'],
      url: '/test/item-4',
    };

    const wrapper = mount(CategoryGrid, {
      props: {
        items: [itemWithManyTags],
        category: 'skills',
      },
    });

    const tags = wrapper.findAll('.tag');
    expect(tags.length).toBe(3); // Only first 3 tags shown

    const moreIndicator = wrapper.find('.tag-more');
    expect(moreIndicator.exists()).toBe(true);
    expect(moreIndicator.text()).toBe('+2');
  });

  it('should render "No description available" when description is missing', () => {
    const itemWithoutDescription = {
      id: 'item-5',
      title: 'Item without description',
      tags: [],
      url: '/test/item-5',
    };

    const wrapper = mount(CategoryGrid, {
      props: {
        items: [itemWithoutDescription],
        category: 'skills',
      },
    });

    expect(wrapper.text()).toContain('No description available');
  });
});
