export const headerLinks = [
    {
        label: "Home",
        route: "/",
    },
    {
        label: "About",
        route: "/about",
    },
    {
        label: "Create Event",
        route: "/events/create",
    },
    {
        label: "Profile",
        route: "/profile",
    }
];

export const eventDefaultValues = {
    title: "",
    description: "",
    location: "",
    imageUrl: "",
    startDateTime: new Date(),
    endDateTime: new Date(),
    categoryId: "",
}

export const tokenVerificationBaseLink = `${process.env.BASE_URL}/verify-token?token=`

export const passwordResetTokenBaseLink = `${process.env.BASE_URL}/new-password?token=`