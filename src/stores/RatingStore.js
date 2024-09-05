import {flow, makeAutoObservable} from "mobx";

// Store for managing rankings of (search) results
class RatingStore {
  constructor(rootStore) {
    makeAutoObservable(this);

    this.rootStore = rootStore;
  }

  get client() {
    return this.rootStore.client;
  }

  SetRatingResults = flow(function * ({objectId, startTime, endTime, indexId, query, rating}) {
    const token = yield this.client.CreateSignedToken({
      objectId,
      duration: 24 * 60 * 60 * 1000,
    });

    const userAddr = yield this.client.CurrentAccountAddress();
    const url = `https://appsvc.svc.eluv.io/state/main/app/search_v2/feedback/${userAddr}/set?authorization=${token}`;
    const itemBody = {
      item: {
        content: objectId,
        clip_start: startTime,
        clip_end: endTime,
        index: indexId,
        query: query,
      },
      rating: rating,
    };
    const body = JSON.stringify(itemBody);

    try {
      // eslint-disable-next-line no-console
      console.log("url", url, "body", body);
      return this.client.Request({url, body, method: "POST"});
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error("Failed to get rating results", error);
    }
  });

  GetRatingResults = flow(function * ({objectId, startTime, endTime, indexId, query}) {
    const token = yield this.client.CreateSignedToken({
      objectId,
      duration: 24 * 60 * 60 * 1000,
    });

    const userAddr = yield this.client.CurrentAccountAddress();
    const url = `https://appsvc.svc.eluv.io/state/main/app/search_v2/feedback/${userAddr}/get?authorization=${token}`;
    const itemBody = {
      item: {
        content: objectId,
        clip_start: startTime,
        clip_end: endTime,
        index: indexId,
        query: query,
      }
    };
    const body = JSON.stringify(itemBody);

    try {
      // eslint-disable-next-line no-console
      console.log("url", url, "body", body);
      return this.client.Request({url, body, method: "POST"});
    } catch(error) {
      // eslint-disable-next-line no-console
      console.error("Failed to get rating results", error);
    }
  });
}

export default RatingStore;
