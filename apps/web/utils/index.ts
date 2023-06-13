export * from "./storage";
export * from "./token";

export function formDataToObject(formData: FormData) {
  return Array.from(formData.entries()).reduce((obj, [key, value]) => {
    obj[key] = value;
    return obj;
  }, {} as Record<string, any>);
}
