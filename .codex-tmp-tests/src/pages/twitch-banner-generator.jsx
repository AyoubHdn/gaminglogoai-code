export const getServerSideProps = async () => {
    return {
        redirect: {
            destination: "/twitch-banner-funnel",
            permanent: false,
        },
    };
};
const TwitchBannerGeneratorRedirectPage = () => {
    return null;
};
export default TwitchBannerGeneratorRedirectPage;
