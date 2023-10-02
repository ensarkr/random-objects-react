const isSerializable: (value: unknown) => boolean = (value) => {
  try {
    JSON.stringify(value);
  } catch (error) {
    console.log("non-serializable variable");
    console.log(error as Error);
    return false;
  }
  return true;
};

export { isSerializable };
