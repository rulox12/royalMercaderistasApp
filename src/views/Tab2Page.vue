<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="header">
        <ion-title style="font-size: 20px;">Ordenes</ion-title>
        <ion-buttons slot="end">
          <ion-button class="change-shop" @click="loadOrders">Actualizar Lista</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-list lines="full">
        <ion-item>
          <ion-label style="font-weight: bold;">FECHA</ion-label>
          <ion-label style="font-weight: bold;">ESTADO</ion-label>
          <ion-label style="font-weight: bold;">NOMBRE</ion-label>
        </ion-item>
        <ion-item v-for="order in orders" :key="order._id">
          <ion-label style="font-size: 14px">{{new Date(order.date).toLocaleDateString("es-CO",optionsDate) }}</ion-label>
          <ion-label>{{ order.status === 'Pending' ? 'Enviado' : 'Aprobado' }}</ion-label>
          <ion-label>{{ order.shop.name }}</ion-label>
        </ion-item>
      </ion-list>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonButton, IonButtons } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { OrderService } from '@/services/OrderService';

const orderService = new OrderService();
const orders = ref([]);
const user = ref()
const optionsDate = {
  timeZone: 'UTC'
};

interface OrderResponse {
  orders: any[];
}

const loadOrders = async () => {
  try {
    user.value = JSON.parse(localStorage.getItem('user') || '{}');
    const query = {
      'user': user.value._id
    };

    const response = await orderService.getAll(query) as OrderResponse | boolean;
    if (response && typeof response !== 'boolean' && Array.isArray(response.orders)) {
      orders.value = response.orders.sort((a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else {
      orders.value = []
    }
  } catch (error) {
    console.error('Error al cargar las órdenes:', error);
  }
};

onMounted(() => {
  loadOrders();
});

</script>

<style scoped>
ion-toolbar.header {
  --background: linear-gradient(90deg, rgba(170, 217, 187, 1) 0%, rgba(128, 188, 189, 1) 50%, rgba(249, 247, 201, 1) 100%);
  --color: #fff;
}

ion-button.change-shop {
  --background: rgba(128, 188, 189, 1);
  --color: #fff;
  --border-radius: 10px;
}
</style>
