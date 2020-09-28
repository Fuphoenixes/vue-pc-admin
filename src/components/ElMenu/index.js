import ElMenu from './src/menu';
import ElMenuItem from './src/menu-item';
import ElMenuItemGroup from './src/menu-item-group';
import ElSubmenu from './src/submenu';

/* istanbul ignore next */
ElMenu.install = function(Vue) {
	Vue.component(ElMenu.name, ElMenu);
	Vue.component(ElMenuItem.name, ElMenuItem);
  Vue.component(ElMenuItemGroup.name, ElMenuItemGroup);
	Vue.component(ElSubmenu.name, ElSubmenu);
};
export default ElMenu
