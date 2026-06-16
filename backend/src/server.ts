import app from "./app";
import { DEFAULT_PORT } from "./config/server";

const PORT = process.env.PORT || DEFAULT_PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
