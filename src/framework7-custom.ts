import Accordion from "framework7/components/accordion/accordion.js";
import Actions from "framework7/components/actions/actions.js";
import Autocomplete from "framework7/components/autocomplete/autocomplete.js";
import Card from "framework7/components/card/card.js";
import Checkbox from "framework7/components/checkbox/checkbox.js";
import Chip from "framework7/components/chip/chip.js";
import DataTable from "framework7/components/data-table/data-table.js";
import Dialog from "framework7/components/dialog/dialog.js";
import Fab from "framework7/components/fab/fab.js";
import Form from "framework7/components/form/form.js";
import Grid from "framework7/components/grid/grid.js";
import InfiniteScroll from "framework7/components/infinite-scroll/infinite-scroll.js";
import Input from "framework7/components/input/input.js";
import Lazy from "framework7/components/lazy/lazy.js";
import LoginScreen from "framework7/components/login-screen/login-screen.js";
import Notification from "framework7/components/notification/notification.js";
import Panel from "framework7/components/panel/panel.js";
import PhotoBrowser from "framework7/components/photo-browser/photo-browser.js";
import Picker from "framework7/components/picker/picker.js";
import Popover from "framework7/components/popover/popover.js";
import Popup from "framework7/components/popup/popup.js";
import Preloader from "framework7/components/preloader/preloader.js";
import Progressbar from "framework7/components/progressbar/progressbar.js";
import PullToRefresh from "framework7/components/pull-to-refresh/pull-to-refresh.js";
import Radio from "framework7/components/radio/radio.js";
import Searchbar from "framework7/components/searchbar/searchbar.js";
import Sheet from "framework7/components/sheet/sheet.js";
import Skeleton from "framework7/components/skeleton/skeleton.js";
import SmartSelect from "framework7/components/smart-select/smart-select.js";
import Stepper from "framework7/components/stepper/stepper.js";
import Swiper from "framework7/components/swiper/swiper.js";
import Tabs from "framework7/components/tabs/tabs.js";
import TextEditor from "framework7/components/text-editor/text-editor.js";
import Toggle from "framework7/components/toggle/toggle.js";
import Tooltip from "framework7/components/tooltip/tooltip.js";
import TreeView from "framework7/components/treeview/treeview.js";
import Typography from "framework7/components/typography/typography.js";
import VirtualList from "framework7/components/virtual-list/virtual-list.js";
import Framework7, { Device, Request, Utils } from "framework7/framework7-lite.esm.js";

Framework7.use([
  Dialog,
  Popup,
  LoginScreen,
  Popover,
  Actions,
  Sheet,
  Preloader,
  Progressbar,
  Accordion,
  VirtualList,
  Tabs,
  Panel,
  Card,
  Chip,
  Form,
  Input,
  Checkbox,
  Radio,
  Toggle,
  SmartSelect,
  Grid,
  Picker,
  InfiniteScroll,
  PullToRefresh,
  Lazy,
  DataTable,
  Fab,
  Searchbar,
  Swiper,
  PhotoBrowser,
  Notification,
  Autocomplete,
  Tooltip,
  Skeleton,
  Typography,
  Stepper,
  TextEditor,
  TreeView,
]);

export default Framework7;
export { Device, Request, Utils };
