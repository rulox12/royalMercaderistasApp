<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="header">
        <ion-title class="title">Órdenes</ion-title>
        <ion-buttons slot="end">
          <ion-button class="update-button" @click="loadOrders">Actualizar Lista</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <div class="orders-wrapper">
        <div v-for="order in orders" :key="order._id" class="order-card"
          :class="order.status === 'Pending' ? 'status-pending' : 'status-approved'">
          <div class="order-row">
            <span class="label">Fecha:</span>
            <span class="value">{{ new Date(order.date).toLocaleDateString("es-CO", optionsDate) }}</span>
          </div>
          <div class="order-row">
            <span class="label">Estado:</span>
            <span class="value">{{ order.status === 'Pending' ? 'Enviado' : 'Aprobado' }}</span>
          </div>
          <div class="order-row">
            <span class="label">Nombre:</span>
            <span class="value">{{ order.shop.name }}</span>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonButton, IonButtons
} from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { OrderService } from '@/services/OrderService';

const orderService = new OrderService();
const orders = ref([]);
const user = ref();
const optionsDate = {
  timeZone: 'UTC'
};

interface OrderResponse {
  orders: any[];
}

const loadOrders = async () => {
  try {
    user.value = JSON.parse(localStorage.getItem('user') || '{}');
    const query = { 'user': user.value._id };

    const response = await orderService.getAll(query) as OrderResponse | boolean;
    if (response && typeof response !== 'boolean' && Array.isArray(response.orders)) {
      orders.value = response.orders.sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else {
      orders.value = [];
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
.header {
  --background: linear-gradient(90deg, rgba(170, 217, 187, 1), rgba(128, 188, 189, 1), rgba(249, 247, 201, 1));
  --color: #fff;
}

.title {
  font-size: 20px;
  font-weight: bold;
}

.update-button {
  --background: rgba(128, 188, 189, 1);
  --color: #fff;
  --border-radius: 10px;
  font-size: 14px;
  padding: 0 12px;
}

.orders-wrapper {
  padding: 16px;
}

.order-card {
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.08);
  padding: 16px;
  margin-bottom: 16px;
}

.order-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 8px;
}

.label {
  font-weight: 600;
  color: #666;
}

.value {
  font-weight: 500;
  color: #222;
}

.status-pending {
  background-color: #fff9e6; /* amarillo suave */
}

.status-approved {
  background-color: #e6f9e6; /* verde suave */
}
</style>