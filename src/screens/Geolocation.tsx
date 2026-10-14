import Layout from "@/components/Layout";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import useGeolocation from "@/hooks/useGeolocation";
import { ShieldAlert } from "lucide-react";

const Geolocation = () => {
  const { coords, getGeolocation, geolocationError, geolocationLoading } =
    useGeolocation();
  return (
    <Layout
      title="Get user browser geolocation"
      brief="https://www.reacterry.com/portal/challenges/use-geolocation"
      description="A reusable hook to request for permission and get the browser's geolocation"
    >
      <div className="w-full h-full flex flex-row items-center justify-center">
        <div className="flex flex-col gap-y-6 items-center justify-center">
          <Button
            size="lg"
            onClick={() => {
              getGeolocation();
            }}
            disabled={geolocationLoading}
          >
            Get geolocation
          </Button>
          {!geolocationLoading && Object.values(coords).every((x) => !!x) && (
            <p className="text-lg">{JSON.stringify(coords)}</p>
          )}
          {geolocationLoading && <Spinner />}
          {!geolocationLoading && !!geolocationError && (
            <Alert>
              <ShieldAlert />
              <AlertTitle>Error getting geolocation!</AlertTitle>
              <AlertDescription>{geolocationError}</AlertDescription>
            </Alert>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Geolocation;
