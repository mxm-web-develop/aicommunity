export function sanitizeMongoData<T>(data: T): T {
    return JSON.parse(JSON.stringify(data, (key, value) => {
      if (value && typeof value === 'object' && value._id) {
        return { ...value, _id: value._id.toString() };
      }
      return value;
    }));
  }