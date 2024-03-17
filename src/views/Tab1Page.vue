<template>
  <ion-page>
    <ion-header>
      <ion-toolbar class="header">
        <ion-buttons slot="start">
          <ion-button class="change-city" @click="changeCity">{{ selectedCityName ?? '' }}</ion-button>
        </ion-buttons>
        <ion-buttons slot="end">
          <ion-button class="change-shop" @click="changeShop">{{ selectedShopName }}</ion-button>
        </ion-buttons>
      </ion-toolbar>
      <ion-toolbar>
        <ion-title>{{ date }}</ion-title>
        <ion-buttons slot="end">
          <ion-button @click="openDateAlert">CAMBIAR FECHA</ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-grid>
        <ion-row class="ion-align-items-end">
          <ion-col style="font-size: 12px !important" size="4">
            NOMBRE
          </ion-col>
          <ion-col style="font-size: 12px !important">
            INVE
          </ion-col>
          <ion-col style="font-size: 12px !important">
            AVER
          </ion-col>
          <ion-col style="font-size: 12px !important">
            LOTE
          </ion-col>
          <ion-col style="font-size: 12px !important">
            RECI
          </ion-col>
          <ion-col style="font-size: 12px !important">
            PEDI
          </ion-col>
        </ion-row>
      </ion-grid>
      <ion-grid>
        <ion-row class="ion-align-items-center" v-for="(list, index) in lists" :key="list._id"
          :class="{ 'pastel-color-1': index % 2 === 0, 'pastel-color-2': index % 2 !== 0 }" style=" border:solid">
          <ion-col style="font-size: 14px !important; font-weight: bold !important; color:black;"
            size="4" :style="{ backgroundColor: getColorStyle(index) }">
            {{ list.productId.displayName }}
          </ion-col>
          <ion-col v-for="field in ['INVE', 'AVER', 'LOTE', 'RECI', 'PEDI']" :key="field + list.productId"
            class="custom" style="font-size: 16px !important;" :style="{ backgroundColor: getColorStyle(index) }">
            <ion-input v-model="formData[date][list.productId._id][field]" type="number">
            </ion-input>
          </ion-col>
        </ion-row>
      </ion-grid>

      <ion-button class="button-save" expand="full" @click="saveFormData">Guardar</ion-button>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonCol, IonButtons, IonGrid, IonRow, IonToolbar, IonHeader, IonContent, IonPage, IonTitle, IonInput, IonButton, alertController, loadingController } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { ListService } from '../services/ListService';
import { OrderService } from '../services/OrderService';
import { ShopService } from '../services/ShopService';
import { CityService } from '../services/CityService';

const selectedShopName = ref('');
const selectedCityName = ref('');
const selectedShopId = ref('');
const selectedCityId = ref('');
const selectedUserId = ref('');
const date = ref('')
const currentDate = new Date();
const listService = new ListService();
const orderService = new OrderService();
const shopService = new ShopService();
const cityService = new CityService();
const lists = ref([]);
const formData = ref({});
const alertInputs = ref([]);

onMounted(async () => {
  date.value = getFormattedDate(0);
  await loadFormData();
});

const getColorStyle = (index) => {
  return index % 2 === 0 ? '#e8fcef' : '#fafce8'
}

const openDateAlert = async () => {
  const alert = await alertController.create({
    message: 'Selecciona una fecha',
    buttons: [
      {
        text: 'Listo',
        htmlAttributes: {
          'aria-label': 'close',
        },
        handler(dateSelected) {
          const selectedShop = JSON.parse(localStorage.getItem('shop') || '{}');
          date.value = changeFormatDate(dateSelected.date)
          console.log(date.value)
          loadFormData()
        }
      },
    ],
    inputs: [
      {
        name: 'date',
        type: 'date',
        value: date.value,
      }
    ]
  });
  return alert.present().then(() => {
    return true;
  })
};

function changeFormatDate(dateToChange: any) {
  const [year, month, day] = dateToChange.split('-');
  return `${day}/${month}/${year}`;
}

const loadFormData = async () => {
  const selectedShop = JSON.parse(localStorage.getItem('shop') || '{}');
  const selectedCity = JSON.parse(localStorage.getItem('city') || '{}');
  selectedUserId.value = JSON.parse(localStorage.getItem('user') || '{}')._id;
  const dates = [date.value]
  const ordersByDate = await orderService.getOrdersByDateAndShop(selectedShop._id, dates);
  console.log(ordersByDate);
  if (selectedShop) {
    const listData = await listService.get(selectedShop.listId, true);
    lists.value = Array.isArray(listData) ? listData : [];
    dates.reduce((acc: any, date: any) => {
      let existingOrder;
      if (ordersByDate && Array.isArray(ordersByDate)) {
        existingOrder = ordersByDate.find((order: any) => order.order.date === date);
      } else {
        existingOrder = false;
      }
      if (existingOrder) {
        formData.value[date] = existingOrder.detailOrder.reduce((products: any, detail: any) => {
          products[detail.product] = {
            INVE: detail.INVE || '',
            AVER: detail.AVER || '',
            LOTE: detail.LOTE || '',
            RECI: detail.RECI || '',
            PEDI: detail.PEDI || '',
            VENT: detail.VENT || '',
          };
          return products;
        }, {});
      } else {
        formData.value[date] = lists.value.reduce((products, list) => {
          products[list.productId._id] = {
            INVE: '',
            AVER: '',
            LOTE: '',
            RECI: '',
            PEDI: '',
            VENT: '',
          };
          return products;
        }, {});
      }
    }, {});
  }
  selectedShopName.value = selectedShop.name || '';
  selectedShopId.value = selectedShop._id || '';
  selectedCityName.value = selectedCity.name || '';
  selectedCityId.value = selectedCity._id || '';
};

const getFormattedDate = (dayDifference: any) => {
  const date = new Date(currentDate);
  date.setDate(date.getDate() + dayDifference);
  return formatDate(date);
};

const formatDate = (date: any) => {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  return `${day}/${month}/${year}`;
};

const saveFormData = async () => {
  const loading = await loadingController.create({
    message: 'Generando la orden',
  });

  loading.present();

  const request = {
    shopId: selectedShopId.value,
    orders: formData.value,
    userId: selectedUserId.value,
    cityId: selectedCityId.value
  }
  console.log(request);
  const response = await orderService.create(request);
  loading.dismiss()
  const alert = await alertController.create({
    message: 'Orden generada correctamente',
    htmlAttributes: {
      'aria-label': 'alert dialog',
    },
    buttons: [
      {
        text: 'Listo',
        htmlAttributes: {
          'aria-label': 'close',
        },
      },
    ],
  });
  alert.present()
};

async function changeShop() {
  const query = {};
  if (selectedCityId) {
    query['cityId'] = selectedCityId.value;
  }
  const shops = await shopService.getAll(query);
  if (shops && Array.isArray(shops)) {
    alertInputs.value = shops.map(shop => ({
      label: shop.name,
      type: 'radio',
      value: shop,
    }));
    openShopSelectionAlert();
  }
}

const openShopSelectionAlert = async () => {
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
          if (shopJSON) {
            localStorage.setItem('shop', shopJSON);
          }
          loadFormData();
        }
      },
    ],

    inputs: alertInputs.value

  });
  return alert.present().then(() => {
    return true;
  })
};

async function changeCity() {
  const cities = await cityService.getAll();
  if (cities) {
    alertInputs.value = cities.map(city => ({
      label: city.name,
      type: 'radio',
      value: city,
    }));
    openCitySelectionAlert();
  }
}

const openCitySelectionAlert = async () => {
  const alert = await alertController.create({
    message: 'Selecciona una ciudad',
    buttons: [
      {
        text: 'Listo',
        htmlAttributes: {
          'aria-label': 'close',
        },
        handler(selectedCity) {
          const cityJSON = JSON.stringify(selectedCity);
          localStorage.setItem('city', cityJSON);
          loadFormData();
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
ion-col {
  background-color: rgba(128, 188, 189, 1);
  padding: 0px;
  color: #fff;
  text-align: center;
}

ion-col.custom {
  background-color: #ffffff;
  border-left: 1px solid #2E4F4F; /* Borde a la izquierda */
  border-right: 1px solid #2E4F4F;
  color: #135d54;
  text-align: center;
  padding: 0px !important;
}

ion-toolbar.header {
  --background: linear-gradient(90deg, rgba(170, 217, 187, 1) 0%, rgba(128, 188, 189, 1) 50%, rgba(249, 247, 201, 1) 100%);
  --color: #fff;
}

ion-segment-button {
  --background: #fff;
}

ion-button.change-shop {
  --background: rgba(128, 188, 189, 1);
  --color: #fff;
  --border-radius: 10px;
}

ion-button.change-city {
  --color: #2E4F4F;
  --background: #fff;
  --border-radius: 10px;
}

.small-input {
  font-size: 10px;
  padding: 2px;
}

.button-save {
  --background: rgba(128, 188, 189, 1);
}

.pastel-color-1 {
  background-color: #e8fcef;
}

.pastel-color-2 {
  background-color: #fafce8;
}
</style>