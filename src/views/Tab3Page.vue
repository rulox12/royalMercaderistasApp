<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="header">
        <ion-title>Perfil</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div v-if="user" style="padding-top: 10%">
        <ion-item>
          <ion-input v-model="user.name" class="custom" label="Nombre" label-placement="floating" readonly></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="user.surname" class="custom" label="Apellido" label-placement="floating"
            readonly></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="user.email" class="custom" label="Correo" label-placement="floating" readonly></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="user.document" class="custom" label="Documento" label-placement="floating"
            readonly></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="password.one" class="custom" label="Contraseña" label-placement="floating"
            type="password"></ion-input>
        </ion-item>
        <ion-item>
          <ion-input v-model="password.two" class="custom" label="Repetir Contraseña" label-placement="floating"
            type="password"></ion-input>
        </ion-item>
        <div class="button-container">
          <ion-button class="button-login" fill="outline" expand="block" @click="updateUser">Actualizar
            Contraseña</ion-button>
        </div>
      </div>
      <div v-else>
        <p>No se pudo cargar la información del usuario.</p>
      </div>
    </ion-content>
  </ion-page>
</template>


<script setup lang="ts">
import { alertController, IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonItem, IonInput, IonButton } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { UserService } from '@/services/UserService';

const userService = new UserService();
const user = ref(null);
const password = ref({
  one: '',
  two: ''
});

const loadUser = async () => {
  user.value = JSON.parse(localStorage.getItem('user') || '{}');
};

const updateUser = async () => {
  try {
    if (password.value.one === password.value.two) {
      console.log(password.value.one);
    } else {
      openAlert('Error', 'Contraseña Incorrecta');
      return;
    }

    const savedUser = await userService.update(user.value._id, { password: password.value.two });

    if (savedUser) {
      const userJson = JSON.stringify(savedUser);
      localStorage.setItem('user', userJson);
      openAlert('Correcto', 'Usuario actualizado');
    } else {
      openAlert('Error', 'No se pudo actualizar el usuario');
    }
  } catch (error) {
    console.error('Error al actualizar la información del usuario:', error);
  }
};

const openAlert = async (title: string, message: string) => {
  const alert = await alertController.create({
    header: title,
    message: message,
    buttons: [
      {
        text: 'Listo',
        htmlAttributes: {
          'aria-label': 'close',
        },
      },
    ],
  });
  return alert.present();
};

onMounted(() => {
  loadUser();
});
</script>
<style>
ion-input.custom {
  --color: #000000;
}

.button-login {
  --border-radius: 40px;
  margin-bottom: 10px;
}

ion-toolbar.header {
  --background: linear-gradient(90deg, rgba(170, 217, 187, 1) 0%, rgba(128, 188, 189, 1) 50%, rgba(249, 247, 201, 1) 100%);
  --color: #fff;
}

ion-toolbar.header {
  --background: linear-gradient(90deg, rgba(170, 217, 187, 1) 0%, rgba(128, 188, 189, 1) 50%, rgba(249, 247, 201, 1) 100%);
  --color: #fff;
}
</style>