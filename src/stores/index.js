import {flow, makeAutoObservable} from "mobx";
import {FrameClient} from "@eluvio/elv-client-js/src/FrameClient.js";
import TenantStore from "@/stores/TenantStore.js";
import SearchStore from "@/stores/SearchStore.js";
import UiStore from "@/stores/UiStore.js";

// Store for loading data on app load
class RootStore {
  client;
  loaded = false;
  tenantId;
  networkInfo;

  constructor() {
    makeAutoObservable(this);

    this.tenantStore = new TenantStore(this);
    this.searchStore = new SearchStore(this);
    this.uiStore = new UiStore(this);
    this.Initialize();
  }

  Initialize = flow(function * () {
    try {
      this.client = new FrameClient({
        target: window.parent,
        timeout: 240
      });

      window.client = this.client;

      this.tenantId = yield this.tenantStore.GetTenantData();
      this.networkInfo = yield this.client.NetworkInfo();
    } catch(error) {
      /* eslint-disable no-console */
      console.error("Failed to initialize application");
      console.error(error);
    } finally {
      this.loaded = true;
    }
  });
}

export const rootStore = new RootStore();
export const tenantStore = rootStore.tenantStore;
export const searchStore = rootStore.searchStore;
export const uiStore = rootStore.uiStore;


if(import.meta.hot) {
  if (import.meta.hot.data.store) {
    // Restore state
    searchStore.currentSearch = import.meta.hot.data.store.currentSearch;
  }

  import.meta.hot.accept();

  import.meta.hot.dispose((data) => {
    // Save state
    data.store = {
      currentSerach: searchStore.currentSearch
    };
  });
}

window.rootStore = rootStore;
