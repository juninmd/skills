import { describe, it, expect } from 'vitest';
import { mount } from '@vue/test-utils';
import CategoryCards from '../CategoryCards.vue';

describe('CategoryCards', () => {
  it('should render', () => {
    const wrapper = mount(CategoryCards, {
      props: {
        category: 'skills'
      }
    });
    expect(wrapper.exists()).toBe(true);
  });
});
