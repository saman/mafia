var app = new Vue({
    el: '#app',
    data: {
        new_player: '',
        new_role: '',
        players: [],
        roles: [],
        default_roles: ['Godfather', 'Mafia', 'Doctor', 'Detective', 'Armoured', 'Sniper' ,'Citizen', 'Silencer', 'Natasha']
    },
    created: function () {
        this.load();
    },
    watch: {
        players: function () {
            this.save();
        },
        roles: function () {
            this.save();
        }
    },
    computed: {
        roles_count: function () {
            const list = []
            this.default_roles.map(x => list.push({ name: x, count: 0 }));
            this.roles.map(x => {
                list.map(y => {
                    if (x.name == y.name) {
                        y.count += 1;
                    };
                });
            })
            return list;
        }
    },
    methods: {
        addPlayer: function () {
            if (this.new_player.length > 0) {
                if (this.roles.length > 0) {
                    const new_roles = this.roles.filter(x => this.isEmptyObj(x.player));
                    if (new_roles.length > 0) {
                        const rndIndex = this.rndBetween(0, new_roles.length - 1);
                        const player = { name: this.new_player, role: new_roles[rndIndex] };
                        this.players.push(player);
                        new_roles[rndIndex].player = this.players[this.players.length - 1];
                        this.new_player = '';
                    } else {
                        alert("All roles has been assigned to players.");
                    }
                } else {
                    alert("Roles are empty.");
                }
            } else {
                alert("Player's name is empty.");
            }
        },
        addRole: function () {
            if (this.new_role.length > 0) {
                const new_role = { name: this.new_role, player: {} };
                this.roles.push(new_role);
            } else {
                alert("Please select a role.");
            }
        },
        removeRole: function (index) {
            const player = this.roles[index].player;
            if (!this.isEmptyObj(player)) {
                playerIndex = this.players.findIndex(x => x === player);
                this.players.splice(playerIndex, 1);
            }
            this.roles.splice(index, 1);
        },
        removePlayer: function (index) {
            this.roles.map(x => {
                if (x.player === this.players[index]) {
                    x.player = {};
                };
            });
            this.players.splice(index, 1);
        },
        rndBetween: function (min, max) {
            return Math.floor(Math.random() * max) + min;
        },
        load: function () {
            const json_roles = JSON.parse(localStorage.getItem('roles')) || [];
            const json_players = JSON.parse(localStorage.getItem('players')) || [];
            json_roles.map(x => x.player = json_players[x.player] || {});
            json_players.map(x => x.role = json_roles[x.role] || {});

            this.roles = json_roles;
            this.players = json_players;
        },
        save: function () {
            const json_roles = [];
            const json_players = [];
            this.roles.map(x => {
                json_roles.push({
                    name: x.name,
                    player: this.players.findIndex(y => y == x.player),
                })
            });
            this.players.map(x => {
                json_players.push({
                    name: x.name,
                    role: this.roles.findIndex(y => y == x.role),
                })
            });
            localStorage.setItem('roles', JSON.stringify(json_roles));
            localStorage.setItem('players', JSON.stringify(json_players));
        },
        isEmptyObj: function (obj) {
            return Object.entries(obj).length === 0;
        }
    },
})