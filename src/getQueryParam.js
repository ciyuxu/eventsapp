export default function getQueryParam(key) {
  const queryString = window.location.hash.slice(1);
  // queryString = "access_token=...&scope=..."
  const parameters = queryString.split("&");
  // parameters = ["access_token=...", "scope=..."]
  for (const parameter of parameters) {
    const [encodedKey, encodedValue] = parameter.split("=");
    // first loop: [encodedKey, encodedValue] = ["access_token", "..."]
    if (decodeURIComponent(encodedKey) === key) {
      return decodeURIComponent(encodedValue);
    }
  }
  return null;
}
