import "./scss/app.scss";

require("angular");
require("angular-animate");
require("angular-sanitize");
require("ng-redux");

// ionic specific imports
require("ionic-sdk/release/js/angular-ui/angular-ui-router");
require("ionic-sdk/release/js/ionic");
require("ionic-sdk/release/js/ionic-angular");

// ionic ui modules
require("ionic-content-banner/dist/ionic.content.banner");
require("ionic-filter-bar/dist/ionic.filter.bar");

window.angular
  .module("app", [
    "jett.ionic.filter.bar",
    "jett.ionic.content.banner",
    "ionic",
    "ngRedux"
  ])
  .config([
    "$ionicConfigProvider",
    "$ionicFilterBarConfigProvider",
    function ($ionicConfigProvider, $ionicFilterBarConfigProvider) {
      $ionicFilterBarConfigProvider.theme("royal");
      $ionicConfigProvider.scrolling.jsScrolling(false);
      $ionicConfigProvider.views.transition("ios");
    }
  ])
  .config([
    "$stateProvider",
    "$urlRouterProvider",
    function ($stateProvider, $urlRouterProvider) {
      $stateProvider.state("HOME", {
        url: "/",
        template: `
          <ion-view view-title="Intro">
            <ion-nav-buttons side="left">
              <button class="button  button-clear no-animation">
                <i class="ion-android-close"></i>
                {{vm.demo}}
              </button>
            </ion-nav-buttons>

            <ion-nav-buttons side="right">
              <button class="button  button-clear no-animation" ng-click="vm.update()">
                <i class="ion-ios-arrow-thin-right"></i>
              </button>
            </ion-nav-buttons>

            
          </ion-view>`,
        controller: "AppController",
        controllerAs: "vm"
      });

      $urlRouterProvider.otherwise("/");
    }
  ])
  .controller("AppController", [
    "$ngRedux",
    "$scope",
    function ($ngRedux, $scope) {
      this.update = () => $ngRedux.dispatch({ type: "PING" });
      let unsubscribe = $ngRedux.connect((state) => {
        return { demo: state.example };
      })(this);
      $scope.$on("$destroy", unsubscribe);
    }
  ])
  .config(($ngReduxProvider) => {
    const reducers = {
      example: (state = 0, action) =>
        action.type === "PONG" ? state + 1 : state
    };
    const { createStore, combineReducers, applyMiddleware } = require("redux");
    const { composeWithDevTools } = require("redux-devtools-extension");
    const composeEnhancers = composeWithDevTools({ name: "example" });

    const { delay, mapTo } = require("rxjs/operators");
    const {
      createEpicMiddleware,
      combineEpics,
      ofType
    } = require("redux-observable");
    const epicMiddleware = createEpicMiddleware();

    const store = createStore(
      combineReducers(reducers),
      composeEnhancers(applyMiddleware(epicMiddleware))
    );

    const exampleEpic = (action$) =>
      action$.pipe(ofType("PING"), delay(1000), mapTo({ type: "PONG" }));
    epicMiddleware.run(combineEpics(exampleEpic));
    $ngReduxProvider.provideStore(store);
  });
