import express, {
  Request as RequestExpress,
  Response as ResponseExpress,
} from "express";
import { v4 as uuidv4 } from "uuid";
import { Cow } from "./example";

const app = express();
const port = 3000;
export let tracerId: any;

app.use(express.json());

app.get("/", (req: RequestExpress, res: ResponseExpress) => {
  tracerId = req.headers["x-tracer-id"] || uuidv4();
  new Cow().say(req, res);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
