import { h, defineAsyncComponent } from 'vue';
import DefaultTheme from 'vitepress/theme';
import './stitch.css';
import { initComponent } from 'vitepress-mermaid-preview/component';
import 'vitepress-mermaid-preview/dist/index.css';

// Lazy load components for better performance
const SearchBox = defineAsyncComponent(() => import('../components/SearchBox.vue'));
const CategoryGrid = defineAsyncComponent(() => import('../components/CategoryGrid.vue'));
const CategoryCards = defineAsyncComponent(() => import('../components/CategoryCards.vue'));
const CategoryLayout = defineAsyncComponent(() => import('../components/CategoryLayout.vue'));
const SkillPage = defineAsyncComponent(() => import('../components/SkillPage.vue'));
const InstallTabs = defineAsyncComponent(() => import('../components/InstallTabs.vue'));

// SkillShell is used in layout, keep it eagerly loaded
import SkillShell from '../components/SkillShell.vue';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'aside-top': () => h(SkillShell)
    });
  },
  enhanceApp({ app }) {
    // Registra componentes globalmente
    initComponent(app);
    app.component('SearchBox', SearchBox);
    app.component('CategoryGrid', CategoryGrid);
    app.component('CategoryCards', CategoryCards);
    app.component('CategoryLayout', CategoryLayout);
    app.component('SkillPage', SkillPage);
    app.component('SkillShell', SkillShell);
    app.component('InstallTabs', InstallTabs);
  }
};
