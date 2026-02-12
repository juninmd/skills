import { h } from 'vue';
import DefaultTheme from 'vitepress/theme';
import SearchBox from '../components/SearchBox.vue';
import CategoryGrid from '../components/CategoryGrid.vue';
import InstallGuide from '../components/InstallGuide.vue';
import CategoryCards from '../components/CategoryCards.vue';
import CategoryLayout from '../components/CategoryLayout.vue';
import SkillPage from '../components/SkillPage.vue';
import SkillShell from '../components/SkillShell.vue';
import './stitch.css';

export default {
  extends: DefaultTheme,
  Layout: () => {
    return h(DefaultTheme.Layout, null, {
      'doc-top': () => h(SkillShell)
    });
  },
  enhanceApp({ app }) {
    // Registra componentes globalmente
    app.component('SearchBox', SearchBox);
    app.component('CategoryGrid', CategoryGrid);
    app.component('InstallGuide', InstallGuide);
    app.component('CategoryCards', CategoryCards);
    app.component('CategoryLayout', CategoryLayout);
    app.component('SkillPage', SkillPage);
    app.component('SkillShell', SkillShell);
  }
};
