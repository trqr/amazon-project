import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js";

export const deliveryOptions = [{
    id: "1",
    deliveryDays: 7,
    priceCents: 0
}, {
    id: "2",
    deliveryDays: 3,
    priceCents: 499
}, {
    id: "3",
    deliveryDays: 1,
    priceCents: 999,
}];

// export function calculateDeliveryDate(deliveryOption) {
//     let deliveryDay = "";
//     deliveryOptions.forEach((option) => {
//         if (option.id === deliveryOption) {
//             if (dayjs().add(option.deliveryDays, "days").format("dddd") === "Saturday") {
//                 deliveryDay = dayjs().add((option.deliveryDays + 2), "days").format("dddd, MMMM D");
//             } else if (dayjs().add(option.deliveryDays, "days").format("dddd") === "Sunday") {
//                 deliveryDay = dayjs().add((option.deliveryDays + 1), "days").format("dddd, MMMM D");
//             } else {
//                 deliveryDay = dayjs().add(option.deliveryDays, "days").format("dddd, MMMM D");
//             }

//         }
//     })
//     return deliveryDay;
// }


export function calculateDeliveryDate(deliveryOption) {
    let deliveryDay = "";
    let weekendDays = 0;
    let i = 0;
    deliveryOptions.forEach((option) => {
        if (option.id === deliveryOption) {
            while (i <= option.deliveryDays) {
                if (dayjs().add((i + weekendDays), "days").format("dddd") === "Saturday" || dayjs().add((i + weekendDays), "days").format("dddd") === "Sunday") {
                    weekendDays++;
                } else {
                    i++;
                }
            }
            deliveryDay = dayjs().add((option.deliveryDays + weekendDays), "days").format("dddd, MMMM D");
        }
    })
    return deliveryDay;
}


