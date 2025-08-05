<template>
    <ion-page class="ion-padding light-background">
        <br>
        <div class="logo-container">
            <ion-img src="https://i.ibb.co/T2Vq30h/logo-royal-web.jpg" alt="Royal Fruit" class="logo-wrapper">
            </ion-img>
        </div>
        <ion-content class="ion-padding light-background">
            <form>
                <ion-item>
                    <ion-input v-model="email" class="custom" label="Correo" label-placement="floating"></ion-input>
                </ion-item>
                <ion-item>
                    <ion-input v-model="password" class="custom" label="Contraseña" label-placement="floating"
                        :type="showPassword ? 'text' : 'password'" :maxlength="20">
                    </ion-input>
                    <ion-icon :icon="showPassword ? eyeOffOutline : eyeOutline" slot="end"
                        @click="togglePasswordVisibility" style="cursor: pointer;">
                    </ion-icon>
                </ion-item>
                <ion-button size="small" fill="clear" class="forgot-password" @click="showForgotPasswordAlert">
                    ¿Olvidaste la contraseña?
                </ion-button>
                <div class="button-container">
                    <ion-button class="button-login" fill="outline" expand="block" @click="login">Ingresar</ion-button>
                </div>
            </form>
        </ion-content>
        <ion-toast :is-open="isOpenMessageError" :message=messageError :duration="5000"
            @didDismiss="setOpen()"></ion-toast>
    </ion-page>
</template>

<script setup lang="ts">
defineProps();
import { IonPage, IonItem, IonButton, IonInput, alertController, IonImg, IonContent, IonToast, IonIcon } from '@ionic/vue';
import { eyeOutline, eyeOffOutline } from 'ionicons/icons';
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
const showPassword = ref(false);
const icons = { eyeOutline, eyeOffOutline };

async function login() {
    email.value = email.value.trim();
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

const togglePasswordVisibility = () => {
    showPassword.value = !showPassword.value;
};

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
    const shops = await shopService.getAll({ cityId });
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

const showForgotPasswordAlert = async () => {
    const alert = await alertController.create({
        header: 'Recuperar Contraseña',
        message: 'Por favor solicita la modificación de la contraseña al administrador del sistema.',
        buttons: ['Aceptar']
    });
    await alert.present();
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

ion-icon[slot="end"] {
    font-size: 22px;
    margin-right: 12px;
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

.light-background {
    --background: #f7f7f7;
    background: #f7f7f7;
    /* Gris muy clarito */
}

ion-item {
    --background: #fff;
    --border-radius: 10px;
    --padding-start: 12px;
    --padding-end: 12px;
    --inner-padding-end: 0;
    margin-bottom: 12px;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.05);
}

ion-input {
    --placeholder-color: #999;
    --color: #333;
}

.button-login {
    --background: #5daeb1;
    --border-radius: 24px;
    --color: white;
    font-weight: bold;
    letter-spacing: 0.5px;
}

.button-login:hover {
    filter: brightness(1.1);
}

ion-button {
    text-transform: none;
}

.logo-wrapper {
    background-color: white;
    width: 160px;
    height: 80px;
    border-radius: 50%;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
    /* opcional para que se vea mejor */
}

.logo-wrapper ion-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
}
</style>
