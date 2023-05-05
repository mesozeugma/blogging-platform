import { NotFoundException } from "../utils/exceptions/not-found-exception";

export function routeNotFound() {
  throw new NotFoundException();
}
