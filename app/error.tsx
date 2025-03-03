"use client";

import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ErrorProps {
  error: Error;
  reset: () => void;
}

const Error = ({ error, reset }: ErrorProps) => {
  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="p-5 w-full max-w-sm flex flex-col aspect-square">
        <CardHeader>
          <CardTitle className="text-center">
            <h1 className="text-xl">Oops! Something went wrong</h1>
          </CardTitle>
        </CardHeader>
        <CardContent className="grow flex-1 flex items-center justify-center">
          <p className="text-lg text-destructive my-auto ">{error.message}</p>
        </CardContent>
        <CardFooter className="flex items-center gap-4">
          <Button variant="outline" className="flex-1" onClick={() => reset()}>
            Try again
          </Button>
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => (window.location.href = "/")}
          >
            Back To Home
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Error;
