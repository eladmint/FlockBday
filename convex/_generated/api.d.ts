/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as auth from "../auth.js";
import type * as campaigns from "../campaigns.js";
import type * as createDemoUser from "../createDemoUser.js";
import type * as createUser from "../createUser.js";
import type * as forms from "../forms.js";
import type * as http from "../http.js";
import type * as internal_ from "../internal.js";
import type * as posts from "../posts.js";
import type * as subscriptions from "../subscriptions.js";
import type * as test from "../test.js";
import type * as twitter_api from "../twitter-api.js";
import type * as twitter from "../twitter.js";
import type * as users from "../users.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  auth: typeof auth;
  campaigns: typeof campaigns;
  createDemoUser: typeof createDemoUser;
  createUser: typeof createUser;
  forms: typeof forms;
  http: typeof http;
  internal: typeof internal_;
  posts: typeof posts;
  subscriptions: typeof subscriptions;
  test: typeof test;
  "twitter-api": typeof twitter_api;
  twitter: typeof twitter;
  users: typeof users;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
