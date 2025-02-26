<template>
    <ion-page>
        <br>
        <div class="logo-container">
            <ion-img src="https://i.ibb.co/T2Vq30h/logo-royal-web.jpg"
                alt="The Wisconsin State Capitol building in Madison, WI at night"></ion-img>
        </div>
        <ion-content class="ion-padding">
            <form>
                <ion-item>
                    <ion-input v-model="email" class="custom" label="Correo" label-placement="floating"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-input v-model="password" class="custom" label="Contraseña" label-placement="floating"
                        :maxlength="20" type="password"></ion-input>
                </ion-item>
                <ion-button size="small" fill="clear" class="forgot-password">¿Olvidaste la contraseña?</ion-button>
                <div class="button-container">
                    <ion-button class="button-login" fill="outline" expand="block" @click="login">Ingresar</ion-button>
                </div>
            </form>
        </ion-content>
        <ion-content class="ion-padding">
            <ion-toast :is-open="isOpenMessageError" :message=messageError :duration="5000"
                @didDismiss="setOpen()"></ion-toast>
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonItem, IonButton, IonInput, alertController, IonImg, IonContent, IonToast } from '@ionic/vue';
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import { AuthService } from '@/services/AuthService';
import { ShopService } from '@/services/ShopService';
import { CityService } from '@/services/CityService';

const email = ref('');
const isOpenMessageError = ref(false);
const messageError = ref('');
const password = ref('');
const authService = new AuthService();
const shopService = new ShopService();
const cityService = new CityService();
const router = useRouter();
const alertInputs = ref([]);

async function login() {
    const loggedIn = await authService.login(email.value, password.value);
    if (loggedIn.status) {
        const cities = await cityService.getAll();
        if (cities) {
            if (Array.isArray(cities)) {
                alertInputs.value = cities.map(city => ({
                    label: city.name,
                    type: 'radio',
                    value: city,
                }));
                openCitySelectionAlert();
            }
        }
    } else {
        messageError.value = loggedIn.error;
        isOpenMessageError.value = true;

    }
}

const setOpen = () => {
    isOpenMessageError.value = false;
}


const openCitySelectionAlert = async () => {
    const alert = await alertController.create({
        message: 'Selecciona una Ciudad',
        buttons: [
            {
                text: 'Listo',
                htmlAttributes: {
                    'aria-label': 'close',
                },
                handler(selectedCity) {
                    const cityJson = JSON.stringify(selectedCity);
                    localStorage.setItem('city', cityJson);
                    openShopSelectionAlert(selectedCity._id)
                }
            },
        ],
        inputs: alertInputs.value
    });
    return alert.present().then(() => {
        return true;
    })
};

const openShopSelectionAlert = async (cityId) => {
    const shops = await shopService.getAll({cityId});
    if (shops) {
        if (Array.isArray(shops)) {
            alertInputs.value = shops.map(shop => ({
                label: shop.name,
                type: 'radio',
                value: shop,
            }));
        }
    }
    const alert = await alertController.create({
        message: 'Selecciona una tienda',
        buttons: [
            {
                text: 'Listo',
                htmlAttributes: {
                    'aria-label': 'close',
                },
                handler(selectedShop) {
                    const shopJSON = JSON.stringify(selectedShop);
                    localStorage.setItem('shop', shopJSON);
                    router.push('/tabs/tab1');
                }
            },
        ],
        inputs: alertInputs.value
    });
    return alert.present().then(() => {
        return true;
    })
};
</script>

<style scoped>
ion-input.custom {
    --color: #000000;
}

.button-login {
    --border-radius: 40px;
    margin-bottom: 10px;
}

.logo-container {
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}

.logo-image {
    max-width: 30% !important;
    height: auto;
    margin-bottom: 10px;
    /* Ajusta el margen inferior según sea necesario */
}

.forgot-password {
    margin-top: 5px;
    font-size: 12px;
}
</style>
