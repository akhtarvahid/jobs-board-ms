export enum ResponseDescription {
  OK = 'Request processed successfully',
  CREATED = 'Resource created successfully',
  BAD_REQUEST = 'Invalid request data or parameters',
  NOT_FOUND = 'Resource not found with the specified identifier',
  NOT_FOUND_ALL = 'No resources found matching the specified criteria',
  UNAUTHORIZED = 'Authentication required or invalid credentials',
  FORBIDDEN = 'Insufficient permissions for this operation',
  UNPROCESSABLE_ENTITY = 'Request validation failed (semantic errors)',
  INTERNAL_SERVER_ERROR = 'Unexpected server error occurred',
  CONFLICT = 'Resource conflict or duplicate entry',
  NO_CONTENT = 'Request succeeded but no content to return',
  SERVICE_UNAVAILABLE = 'Service temporarily unavailable',
}
