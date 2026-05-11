export const getServerSideProps = async () => {
    return {
        redirect: {
            destination: "/banner-maker",
            permanent: false,
        },
    };
};
const TwitchBannerFunnelRedirectPage = () => {
    return null;
};
export default TwitchBannerFunnelRedirectPage;
