import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import SearchBox from '../SearchBox.vue';

// Mock catalog data
const mockCatalog = {
  skills: [
    {
      id: 'skill-1',
      title: 'Test Skill',
      description: 'A test skill for testing',
      tags: ['test', 'demo'],
      url: '/skills/test-skill',
    },
  ],
  agents: [
    {
      id: 'agent-1',
      title: 'Test Agent',
      description: 'A test agent configuration',
      tags: ['copilot', 'test'],
      url: '/agents/test-agent',
    },
  ],
};

describe('SearchBox', () => {
  beforeEach(() => {
    // Mock global fetch
    global.fetch = vi.fn(() =>
      Promise.resolve({
        json: () => Promise.resolve(mockCatalog),
      })
    ) as any;
  });

  it('should render search input', () => {
    const wrapper = mount(SearchBox);
    const input = wrapper.find('input[type="text"]');
    expect(input.exists()).toBe(true);
    expect(input.attributes('placeholder')).toContain('Search');
  });

  it('should render category filter buttons', () => {
    const wrapper = mount(SearchBox);
    const categories = ['agents', 'skills', 'rules', 'workflows'];

    categories.forEach(category => {
      const button = wrapper.findAll('.filter-btn').find(btn =>
        btn.text() === category
      );
      expect(button).toBeDefined();
    });
  });

  it('should show no results initially', () => {
    const wrapper = mount(SearchBox);
    const noResults = wrapper.find('.no-results');
    expect(noResults.exists()).toBe(true);
  });

  it('should update search query on input', async () => {
    const wrapper = mount(SearchBox);
    const input = wrapper.find('input[type="text"]');

    await input.setValue('test');
    expect((wrapper.vm as any).searchQuery).toBe('test');
  });

  it('should toggle category filter on button click', async () => {
    const wrapper = mount(SearchBox);
    const filterBtn = wrapper.find('.filter-btn');

    await filterBtn.trigger('click');
    expect(filterBtn.classes()).toContain('active');

    await filterBtn.trigger('click');
    expect(filterBtn.classes()).not.toContain('active');
  });

  it('should load catalog on mount', async () => {
    mount(SearchBox);

    // Wait for onMounted to complete
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(global.fetch).toHaveBeenCalledWith('/catalog.json');
  });

  it('should handle fetch errors gracefully', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    global.fetch = vi.fn(() => Promise.reject(new Error('Network error'))) as any;

    mount(SearchBox);

    // Wait for error to be caught
    await new Promise(resolve => setTimeout(resolve, 100));

    expect(consoleErrorSpy).toHaveBeenCalled();
    consoleErrorSpy.mockRestore();
  });

  it('should perform search when miniSearch is ready and filter by category', async () => {
    const wrapper = mount(SearchBox);
    await new Promise(resolve => setTimeout(resolve, 100));

    // Filter by category without query
    const filterBtn = wrapper.find('.filter-btn');
    await filterBtn.trigger('click');
    
    // Type query
    const input = wrapper.find('input[type="text"]');
    await input.setValue('test');
    
    // Check results
    const results = wrapper.findAll('.result-item');
    expect(results.length).toBeGreaterThan(0);
  });
});
