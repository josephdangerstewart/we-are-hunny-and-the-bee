import { compose } from './scene-exector';
import { mainScene } from './main-scene';

compose(mainScene, document.getElementById('root')).execute();
