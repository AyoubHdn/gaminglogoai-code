import { type GetServerSideProps, type NextPage } from "next";

export const getServerSideProps: GetServerSideProps = async () => {
  return {
    redirect: {
      destination: "/twitch-banner-generator",
      permanent: false,
    },
  };
};

const TwitchBannerFunnelRedirectPage: NextPage = () => {
  return null;
};

export default TwitchBannerFunnelRedirectPage;
