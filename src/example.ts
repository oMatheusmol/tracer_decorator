import { tracerId } from "./main";

export class Cow {
  @Tracer
  async say(req, res) {
    try {
      const random_number = Math.floor(Math.random() * 10);
      if (random_number % 2 === 0) throw new Error("Error when say mo");

      return res.status(200).send({ message: "Moo", status: 200 });
    } catch (err: any) {
      Logger.log("say", true, err.message);
      return res.status(500).send({ message: err.message, status: 500 });
    }
  }
}

export class Logger {
  static log(function_name: string, error: boolean, message?: string) {
    if (message) {
      return console.log(
        JSON.stringify({
          TraceId: tracerId,
          Function: function_name,
          Date: new Date(),
          Error: error,
          Message: message,
        }),
      );
    } else {
      return console.log(
        JSON.stringify({
          TraceId: tracerId,
          Function: function_name,
          Date: new Date(),
          Error: error,
        }),
      );
    }
  }
}

function Tracer(
  target: any,
  propertyKey: string,
  descriptor: PropertyDescriptor,
) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args: any[]) {
    const functionName = propertyKey;
    try {
      Logger.log(functionName, false);
      const result = await originalMethod.apply(this, args);
      return result;
    } catch (err: any) {
      Logger.log(functionName, true, err.message);
      throw err;
    }
  };

  return descriptor;
}
