import { v4 as uuidv4 } from "uuid";

export const isArray = (value: any) => {
  return Array.isArray(value);
};

export const oid = (prefix = "") => {
  return `${prefix ?? ""}${uuidv4()}`;
};