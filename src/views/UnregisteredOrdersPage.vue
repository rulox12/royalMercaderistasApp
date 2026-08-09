<template>
  <ion-page>
    <ion-header>
      <!-- Bloque 1: Título -->
      <ion-toolbar class="header">
        <ion-title class="title">Órdenes No Registradas</ion-title>
      </ion-toolbar>

      <!-- Bloque 2: Fechas -->
      <ion-toolbar class="date-toolbar">
        <div class="date-row">
          <div class="date-block">
            <span class="label">Inicio:</span>
            <span class="value">{{ selectedStartDate }}</span>
          </div>
          <div class="date-block">
            <span class="label">Fin:</span>
            <span class="value">{{ selectedEndDate }}</span>
          </div>
        </div>
      </ion-toolbar>

      <!-- Bloque 3: Botones -->
      <!-- Bloque 3: Botones de cambio de fecha -->
      <ion-toolbar class="button-toolbar">
        <div class="button-row">
          <ion-button class="change-date" @click="() => openDateAlert('start')">
            Cambiar Fecha Inicio
          </ion-button>

          <ion-button class="change-date" @click="() => openDateAlert('end')">
            Cambiar Fecha Fin
          </ion-button>
        </div>
      </ion-toolbar>

      <!-- Bloque 4: Botón de búsqueda en su propia fila -->
      <ion-toolbar class="button-toolbar">
        <div class="button-row single">
          <ion-button class="update-button" expand="block" @click="loadOrders">
            Buscar Órdenes
          </ion-button>
        </div>
      </ion-toolbar>
    </ion-header>


    <ion-content :fullscreen="true">
      <!-- Lista de órdenes -->
      <div class="orders-wrapper">
        <div v-for="order in orders" :key="order.shop._id" class="order-card">
          <div class="order-row">
            <span class="label">Fecha:</span>
            <span class="value">{{ formatHumanDate(order.date) }}</span>
          </div>
          <div class="order-row">
            <span class="label">Tienda:</span>
            <span class="value">{{ order.shop?.name }}</span>
          </div>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonButton,
  alertController,
  onIonViewWillEnter
} from '@ionic/vue';
import { ref } from 'vue';
import { OrderService } from '@/services/OrderService';

const orderService = new OrderService();
const orders = ref<any[]>([]);
const selectedShop = ref<any>({});
const today = new Date();
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(today.getDate() - 7);
const formatDate = (date: Date) => date.toISOString().split("T")[0];
const selectedStartDate = ref(formatDate(sevenDaysAgo));
const selectedEndDate = ref(formatDate(today));

const loadOrders = async () => {
  const response = await orderService.getUnregisteredOrdersByShopAndRange(
    selectedShop.value._id,
    selectedStartDate.value,
    selectedEndDate.value
  );
  if (response && typeof response !== 'boolean' && Array.isArray(response.notReceivedShops)) {
    orders.value = response.notReceivedShops;
  } else {
    orders.value = [];
  }
};

function formatHumanDate(dateString: string) {
  const date = new Date(dateString + "T00:00:00");
  return date.toLocaleDateString("es-CO", {
    weekday: "long",  
    day: "numeric",   
    month: "long",   
    year: "numeric"
  });
}

const openDateAlert = async (type: 'start' | 'end') => {
  const currentValue = type === 'start' ? selectedStartDate.value : selectedEndDate.value;

  const alert = await alertController.create({
    message: "Selecciona una fecha",
    buttons: [
      {
        text: "Listo",
        htmlAttributes: {
          "aria-label": "close",
        },
        handler: (dataSelected: any) => {
          const formatted = changeFormatDate(dataSelected.date);
          if (type === 'start') {
            selectedStartDate.value = formatted;
          } else {
            selectedEndDate.value = formatted;
          }
        },
      },
    ],
    inputs: [
      {
        name: "date",
        type: "date",
        value: currentValue,
      },
    ],
  });

  return alert.present();
};

function changeFormatDate(dateToChange: string) {
  const dateWithoutTime = dateToChange.split("T")[0];
  const [year, month, day] = dateWithoutTime.split("-");
  return `${year}-${month}-${day}`;
}

onIonViewWillEnter(() => {
  selectedShop.value = JSON.parse(localStorage.getItem("shop") || "{}");
  loadOrders();
});
</script>
<style scoped>
/* 🔷 Encabezado */
.header {
  --background: linear-gradient(90deg, rgba(170, 217, 187, 1), rgba(128, 188, 189, 1), rgba(249, 247, 201, 1));
  --color: #fff;
}

.title {
  font-size: 18px;
  font-weight: 600;
  text-align: center;
  padding: 4px 0;
}

/* 🔷 Fechas */
.date-toolbar {
  --background: #f8f8f8;
}

.date-row {
  display: flex;
  justify-content: space-around;
  padding: 6px 0;
}

.date-block {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.label {
  font-size: 12px;
  font-weight: 500;
  color: #666;
}

.value {
  font-size: 13px;
  font-weight: 500;
  color: #222;
}

/* 🔷 Botonera */
.button-toolbar {
  --background: #ffffff;
}

.button-row {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 8px;
  padding: 6px 12px;
}

.change-date,
.update-button {
  --background: rgba(128, 188, 189, 1);
  --color: #fff;
  --border-radius: 8px;
  font-size: 13px;
  padding: 4px 10px;
  min-height: 32px;
  min-width: 120px;
  flex: 1 1 auto;
  text-align: center;
}

.update-button {
  max-width: 300px;
}

/* 🔷 Lista de órdenes */
.orders-wrapper {
  padding: 12px;
}

.order-card {
  background-color: #fff;
  border-radius: 10px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.06);
  padding: 12px;
  margin-bottom: 12px;
}

.order-row {
  display: flex;
  justify-content: space-between;
  margin-bottom: 6px;
}

.order-row .label {
  font-size: 12px;
  font-weight: 500;
  color: #555;
}

.order-row .value {
  font-size: 13px;
  font-weight: 500;
  color: #222;
}
</style>
