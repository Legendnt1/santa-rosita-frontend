/**
 * User entity and related types for the authentication module.
 * This file defines the User interface and the UserRole type, which are used across the authentication domain.
 * The User entity represents the authenticated user in the system, and the UserRole type defines 
 * the possible roles a user can have.
 */
export type UserRole = "customer" | "admin";

/**
 * User entity representing the authenticated user in the system. 
 * This is a simple representation and can be extended with more fields as needed (e.g., createdAt, updatedAt, etc.).
 */
export interface User {
  readonly id: string;
  readonly name: string;
  readonly email: string;
  readonly role: UserRole;
  readonly avatar?: string;
}
