import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Lookup from "@/data/Lookup";
import { Button } from "./ui/button";
import axios from "axios";
import { useUser } from "@/context/UserContext";
import { useGoogleLogin } from "@react-oauth/google";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import uuid4 from "uuid4";

function SignInDialog({ openDialog, closeDialog }) {
  const { setUser } = useUser();
  const createUser = useMutation(api.users.CreateUser);

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      console.log(tokenResponse);

      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        { headers: { Authorization: `Bearer ${tokenResponse?.access_token}` } }
      );
      const user = userInfo.data;

      if (!user) return;

      console.log(user);

      await createUser({
        name: user.name,
        email: user.email,
        picture: user.picture,
        uid: uuid4(),
      });

      console.log("ctx");

      if (typeof window !== undefined)
        localStorage.setItem("user", JSON.stringify(user));

      console.log("local");

      setUser(user);
      closeDialog();
    },
  });

  return (
    <Dialog open={openDialog} onOpenChange={closeDialog}>
      <DialogContent className="flex flex-col justify-center items-center">
        <DialogHeader>
          <DialogTitle></DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col items-center"}>
          <h2 className={"font-bold text-2xl dark:text-white"}>
            {Lookup.SIGNIN_HEADING}
          </h2>
          <p className={"mt-2 text-zinc-700"}>{Lookup.SIGNIN_SUBHEADING}</p>

          <Button
            onClick={googleLogin}
            className="bg-blue-500 text-white hover:bg-blue-400 my-7"
          >
            Sign In with Google
          </Button>

          <p className={"text-sm text-zinc-700"}>
            {Lookup.SIGNIN_AGREEMENT_TEXT}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default SignInDialog;

{
  /* <div className={"flex flex-col items-center"}>
  <h2 className={"font-bold text-2xl dark:text-white"}>
    {Lookup.SIGNIN_HEADING}
  </h2>
  <p className={"mt-2"}>{Lookup.SIGNIN_SUBHEADING}</p>

  <Button
    onClick={googleLogin}
    className="bg-blue-500 text-white hover:bg-blue-400 mt-7 mb-3"
  >
    Sign In with Google
  </Button>

  <p>{Lookup.SIGNIN_AGREEMENT_TEXT}</p>
</div>; */
}
