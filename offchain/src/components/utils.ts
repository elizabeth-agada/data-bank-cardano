import { toast } from 'react-hot-toast'

export async function req(path: string, req?: RequestInit) {
  const rsp = await fetch(path, { ...req, cache: "no-cache" });

  if (!rsp.ok) {
    toast.error(
      `Error ${rsp.status}: ${rsp.statusText}. Please try again later.`,
    );
    throw {
      code: rsp.status,
      info: rsp.statusText,
    };
  }

  return rsp.json();
}

export function handleSuccess(success: string | object) {
  toast.success(`${success}`);
  console.log(success);
}

export function handleError(error: { info?: string; message?: string; [key: string]: unknown }) {
  const { info, message } = error;
  const errorMessage = `${message}`;

  try {
    // KoiosError:
    const a = errorMessage.indexOf("{", 1);
    const b =
      errorMessage.lastIndexOf("}", errorMessage.lastIndexOf("}") - 1) + 1;

    const rpc = errorMessage.slice(a, b);
    const jsonrpc = JSON.parse(rpc);

    const errorData = jsonrpc.error.data[0].error.data;

    try {
      const { validationError, traces } = errorData;

      toast.error(`${validationError} Traces: ${traces.join(", ")}.`);
      console.error({ [validationError]: traces });
    } catch {
      const { reason } = errorData;

      toast.error(`${reason}`);
      console.error(reason);
    }
  } catch {
    function toJSON(error: unknown) {
      try {
        const errorString = JSON.stringify(error);
        const errorJSON = JSON.parse(errorString);

        return errorJSON;
      } catch {
        return {};
      }
    }

    const { cause } = toJSON(error);
    const { failure } = cause ?? {};

    const failureCause = failure?.cause;

    let failureTrace: string | undefined;

    try {
      failureTrace = eval(failureCause).replaceAll(" Trace ", " \n ");
    } catch {
      failureTrace = undefined;
    }

    const failureInfo = failureCause?.info;
    const failureMessage = failureCause?.message;

    toast.error(
      `${failureTrace ?? failureInfo ?? failureMessage ?? info ?? message ?? error}`,
    );
    console.error(failureCause ? failureCause : { error: error });
  }
}