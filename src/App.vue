<template>
    <div id="app">
        <h1 class="mt-3"><img src="./assets/logo.png" width="25" height="25">ue.js Sphere App</h1>
        <i>
            Allow users to make a list of points that lay inside the sphere. They should be able to create a new group
            that identifies the radius of circle. Then they will add points to this group and the app will tell them
            which ones are suitable. Users can save or delete the point, If they save, the point must be in the group
            after a page reload. The group should be able to be saved, deleted, or edited.
        </i>
        <div class="container">
            <section>
                <div class="row mt-4">
                    <div>Group Radius:</div>
                    <input type="number" min="0" value="0" v-model="inputField1" class="ml-1" placeholder=""
                           v-on:change="changedRadius"/>
                </div>
                <div class="row  mt-4" v-if="inputField1>0">
                    <div>Comma separated x,y,z point:</div>
                    <input v-model="inputField2" v-on:keyup.enter="addPoint" class="ml-1 mr-1" placeholder=""/>
                    <button @click="addPoint" class="btn btn-primary">Add point</button>
                </div>
            </section>
            <section>
                <div class="row">
                    <div class="col-md-6 mt-3">
                        <ul class="list-group justify-content-center">
                            <li class="row list-group-item border mt-2 col-xs-1" v-for="point in pointsList">
                                <div class="row align-items-center">
                                    <span class="col-sm-6">
                                    {{ point.value }}
                                    </span>
                                    <span class="offset-sm-1 col-sm-2 delete text-right">
                                    <span v-if="point.valid" class="valid">
                                    Valid
                                    </span>
                                    <span v-else class="invalid">
                                    InValid
                                    </span>
                                    </span>
                                    <span title="Delete point" @click="deletePoint(point)"
                                          class="offset-sm-1  delete text-right">X
                                    </span>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </section>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue';
    import BootstrapVue from 'bootstrap-vue';
    import 'bootstrap/dist/css/bootstrap.css'
    import 'bootstrap-vue/dist/bootstrap-vue.css'
    import calcSphere from '../node_module_lev/index';

    export default {
        name: 'app',
        methods: {
            addPoint: function () {
                let value = this.inputField2;
                if (value && value.length >= 5) {
                    let valid = this.isValidValue(value) && this.isWithinRadius(value);
                    this.pointsList.push({ts: +new Date(), value: value, valid: valid});
                    this.inputField2 = '';
                    this.validate();
                }

            },
            isValidValue: function (value) {
                let coordsArray = value.split(',');
                let isValid = coordsArray.length === 3;
                if (isValid) {
                    isValid = coordsArray.every(el => el * 1 === el * 1);
                }
                return isValid;
            },
            isWithinRadius: function (value) {
                let _isWithinRadius = false;
                if (this.isValidValue(value)) {
                    let coordsArray = value.split(',');
                    let x = coordsArray[0];
                    let y = coordsArray[1];
                    let z = coordsArray[2];
                    _isWithinRadius = this.radius > calcSphere(x, y, z).radius;
                }
                return _isWithinRadius;
            },
            validate: function () {

                this.pointsList.map(el => el.valid = this.isWithinRadius(el.value))
            },
            changedRadius: function () {
                this.radius = this.inputField1;
                this.validate();
            },
            deletePoint: function (points) {
                var index = this.pointsList.indexOf(points);
                this.pointsList.splice(index, 1);
            }
        },
        mounted() {
            if (localStorage.pointsList) {
                this.pointsList = JSON.parse(localStorage.pointsList);
            }
            if (localStorage.radius) {
                this.inputField1 = this.radius = localStorage.radius;
            }
        },
        watch: {
            pointsList(newVal) {
                localStorage.pointsList = JSON.stringify(newVal);
            },
            radius(newVal) {
                localStorage.radius = newVal;
            }
        },
        data() {
            return {
                inputField1: '',
                inputField2: '',
                radius: 0,
                pointsList: []
            }
        }
    }
</script>

