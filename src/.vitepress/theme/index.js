import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import SearchBox from '../components/SearchBox.vue';
import CategoryGrid from '../components/CategoryGrid.vue';
import CategoryCards from '../components/CategoryCards.vue';
import CategoryLayout from '../components/CategoryLayout.vue';
import SkillPage from '../components/SkillPage.vue';
import SkillShell from '../components/SkillShell.vue';
import InstallTabs from '../components/InstallTabs.vue';
import './stitch.css';
import { initComponent } from 'vitepress-mermaid-preview/component';
import 'vitepress-mermaid-preview/dist/index.css';

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
