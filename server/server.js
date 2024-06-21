import { port } from "./secret.js";
import { app } from "./app.js";
import db from "./src/config/db.js";

app.listen(port, async () => {
  console.log(`server is running on http://localhost:${port}`);
  await db();
});
