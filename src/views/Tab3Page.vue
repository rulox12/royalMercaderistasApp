<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="header">
        <ion-title class="title">Perfil</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <div v-if="user" class="form-wrapper">
        <div class="readonly-list">
          <div class="readonly-item">
            <span class="label">Nombre</span>
            <span class="value">{{ user.name }}</span>
          </div>
          <div class="readonly-item">
            <span class="label">Apellido</span>
            <span class="value">{{ user.surname }}</span>
          </div>
          <div class="readonly-item">
            <span class="label">Correo</span>
            <span class="value">{{ user.email }}</span>
          </div>
          <div class="readonly-item">
            <span class="label">Documento</span>
            <span class="value">{{ user.document }}</span>
          </div>
        </div>
        <ion-item class="input-item" lines="none">
          <ion-input v-model="password.one" class="custom" label="Contraseña" label-placement="stacked"
            type="password" />
        </ion-item>

        <ion-item class="input-item" lines="none">
          <ion-input v-model="password.two" class="custom" label="Repetir Contraseña" label-placement="stacked"
            type="password" />
        </ion-item>

        <div class="button-container">
          <ion-button class="button-update" expand="block" @click="updateUser">Actualizar Contraseña</ion-button>
        </div>
        <div class="button-container">
          <ion-button class="button-logout" expand="block" @click="logout">Cerrar Sesión</ion-button>
        </div>
      </div>
      <div v-else class="form-wrapper">
        <p>No se pudo cargar la información del usuario.</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  alertController, IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonItem, IonInput, IonButton
} from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { UserService } from '@/services/UserService';

const userService = new UserService();
const user = ref(null);
const password = ref({ one: '', two: '' });

const loadUser = async () => {
  user.value = JSON.parse(localStorage.getItem('user') || '{}');
};

const logout = () => {
  localStorage.clear();
  window.location.reload();
};

const updateUser = async () => {
  try {
    if (password.value.one === password.value.two) {
      const savedUser = await userService.update(user.value._id, { password: password.value.two });
      if (savedUser) {
        localStorage.setItem('user', JSON.stringify(savedUser));
        openAlert('Correcto', 'Usuario actualizado');
      } else {
        openAlert('Error', 'No se pudo actualizar el usuario');
      }
    } else {
      openAlert('Error', 'Contraseña Incorrecta');
    }
  } catch (error) {
    console.error('Error al actualizar usuario:', error);
  }
};

const openAlert = async (title: string, message: string) => {
  const alert = await alertController.create({
    header: title,
    message,
    buttons: [{ text: 'Listo', role: 'cancel' }]
  });
  await alert.present();
};

onMounted(() => {
  loadUser();
});
</script>

<style scoped>
.form-wrapper {
  padding: 24px 16px;
}

ion-input::part(label) {
  font-size: 13px;
  color: #888;
}

.button-container {
  margin-top: 8px;
}

.button-update {
  --background: #80bcbd;
  --color: #fff;
  --border-radius: 24px;
  font-weight: 600;
  letter-spacing: 0.5px;
  height: 44px;
}

.button-logout {
  --background: #fff;
  --border: 2px solid #80bcbd;
  --color: #80bcbd;
  --border-radius: 24px;
  font-weight: 600;
  letter-spacing: 0.5px;
  height: 44px;
}

.input-item {
  margin-bottom: 10px;
  --border-radius: 10px;
  --background: #fff;
  --min-height: 46px;
}

.input-item {
  margin-bottom: 16px;
  --border-radius: 12px;
  --min-height: 50px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.06);
  transition: box-shadow 0.2s ease;
}

.input-item.editable {
  --background: #f9f9f9;
}

.input-item.readonly {
  --background: #f0f4f4;
}

ion-input.custom {
  font-size: 15px;
  --padding-top: 8px;
  --padding-bottom: 8px;
  --color: #222;
  font-weight: 500;
}

ion-input::part(label) {
  font-size: 14px;
  color: #666;
} 

.readonly-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-bottom: 24px;
}

.readonly-item {
  background-color: #f4f4f4;
  border-radius: 10px;
  padding: 12px 16px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.08);
}

.readonly-item .label {
  font-size: 13px;
  color: #888;
  display: block;
  margin-bottom: 4px;
}

.readonly-item .value {
  font-size: 15px;
  font-weight: 500;
  color: #222;
}
</style>