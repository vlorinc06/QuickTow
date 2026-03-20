<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use App\Models\Vehicle;
use App\Models\TowUser;
use App\Models\TowRequest;
use App\Models\Payment;
use App\Models\Rating;

class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        /** ================= USERS (7) ================= */
        $users = [
            ['Kiss', 'Péter', 'peti_k99', 'peti.k99@gmail.com'],
            ['Nagy', 'Anna', 'anna.nagy', 'anna.nagy@freemail.hu'],
            ['Szabó', 'Gábor', 'gabor92', 'g92.szabo@gmail.com'],
            ['Tóth', 'László', 'xXlaciXx', 'laci.toth@outlook.com'],
            ['Varga', 'Eszter', 'eszti_87', 'eszti87@gmail.com'],
            ['Kovács', 'Balázs', 'kbala91', 'balazs91@gmail.com'],
            ['Horváth', 'Dániel', 'danih', 'dani.h@gmail.com'],
        ];

        $userModels = [];
        foreach ($users as $i => $u) {
            $userModels[] = User::create([
                'last_name' => $u[0],
                'first_name' => $u[1],
                'username' => $u[2],
                'password' => Hash::make('password'),
                'email' => $u[3],
                'phone_number' => '+36301234' . (560 + $i),
            ]);
        }

        /** ================= VEHICLES (7) ================= */
        $vehicles = [
            ['ABC-123', 'Toyota', 'Corolla'],
            ['DEF-456', 'Ford', 'Focus'],
            ['GHI-789', 'VW', 'Golf'],
            ['JKL-321', 'Opel', 'Astra'],
            ['MNO-654', 'Skoda', 'Octavia'],
            ['PQR-987', 'BMW', '320d'],
            ['STU-741', 'Audi', 'A4'],
        ];

        $vehicleModels = [];
        foreach ($vehicles as $i => $v) {
            $vehicleModels[] = Vehicle::create([
                'license_plate' => $v[0],
                'brand' => $v[1],
                'model' => $v[2],
                'user' => $userModels[$i]->id,
            ]);
        }

        /** ================= TOW USERS (20) ================= */
        $towUsers = [
            ['Lukács', 'Tamás', 'lukitow', 'tow123', 'lukacs.tamas@tow.hu', '06309998888', 1200, 47.4979, 19.0402, 'available'],
            ['Kocsis', 'Bálint', 'bala', 'towtow', 'kocsis.balint@tow.hu', '06702223333', 1000, 47.5312, 21.6273, 'available'],
            ['Nemes', 'Gergő', 'gergoN', 'gergoTow', 'nemes.gergo@tow.hu', '06305557777', 1100, 47.902, 20.374, 'busy'],
            ['Szűcs', 'Erik', 'eriktow', 'passTow', 'szucs.erik@tow.hu', '06207778888', 2000, 46.253, 20.141, 'available'],
            ['Oláh', 'Kristóf', 'kristow', 'tow2025', 'olah.kristof@tow.hu', '06703334444', 1400, 47.531, 19.05, 'available'],
            ['Török', 'Miklós', 'mikitow', 'miki22', 'torok.miklos@tow.hu', '06302225555', 1500, 47.67, 19.28, 'busy'],
            ['Bognár', 'Ádám', 'adamB', 'adamTow', 'bognar.adam@tow.hu', '06701113333', 1000, 47.92, 20.14, 'offline'],
            ['Szabó', 'Dávid', 'davidtow', 'towpass8', 'szabo.david@tow.hu', '06301112222', 1300, 48.2389, 20.2971, 'available'],
            ['Kovács', 'Bence', 'bencetow', 'towpass9', 'kovacs.bence@tow.hu', '06302223344', 1200, 48.2104, 20.2456, 'available'],
            ['Farkas', 'Márk', 'marktow', 'towpass10', 'farkas.mark@tow.hu', '06303334455', 1250, 48.1998, 20.3149, 'busy'],
            ['Varga', 'Máté', 'matetow', 'towpass11', 'varga.mate@tow.hu', '06304445566', 1400, 48.2632, 20.2518, 'available'],
            ['Nagy', 'Roland', 'rolandtow', 'towpass12', 'nagy.roland@tow.hu', '06305556677', 1100, 48.1659, 20.2705, 'available'],
            ['Horváth', 'Zoltán', 'zolitow', 'towpass13', 'horvath.zoltan@tow.hu', '06306667788', 1500, 48.1205, 20.4022, 'available'],
            ['Tóth', 'Gábor', 'gabortow', 'towpass14', 'toth.gabor@tow.hu', '06307778899', 1600, 48.3406, 20.1801, 'busy'],
            ['Molnár', 'Péter', 'petertow', 'towpass15', 'molnar.peter@tow.hu', '06308889900', 1350, 48.0752, 20.1904, 'available'],
            ['Balogh', 'László', 'laszlotow', 'towpass16', 'balogh.laszlo@tow.hu', '06309990011', 1450, 48.3107, 20.4308, 'offline'],
            ['Kiss', 'Attila', 'attilatow', 'towpass17', 'kiss.attila@tow.hu', '06301239876', 1700, 47.9102, 20.3775, 'available'],
            ['Papp', 'Norbert', 'norbitow', 'towpass18', 'papp.norbert@tow.hu', '06302349876', 1550, 47.9608, 20.0902, 'busy'],
            ['Sipos', 'Gergely', 'geritow', 'towpass19', 'sipos.gergely@tow.hu', '06303459876', 1650, 48.5204, 20.4609, 'available'],
            ['Lakatos', 'István', 'istow', 'towpass20', 'lakatos.istvan@tow.hu', '06304569876', 1800, 48.4309, 19.9504, 'offline'],
        ];

        $towModels = [];
        foreach ($towUsers as $i => $t) {
            $towModels[] = TowUser::create([
                'last_name' => $t[0],
                'first_name' => $t[1],
                'username' => $t[2],
                'password' => Hash::make($t[3]),
                'email' => $t[4],
                'phone_number' => $t[5],
                'price_per_km' => $t[6],
                'latitude' => $t[7],
                'longitude' => $t[8],
                'rating' => 0,
                'rating_count' => 0,
                'status' => $t[9],

            ]);
        }

        /** ================= TOW REQUESTS (7) ================= */
        $requests = [];
        for ($i = 0; $i < 7; $i++) {
            $requests[] = TowRequest::create([
                'user' => $userModels[$i]->id,
                'vehicle' => $vehicleModels[$i]->id,
                'tow_user' => $towModels[$i]->id,
                'pickup_lat' => 47.48 + ($i * 0.01),
                'pickup_long' => 19.01 + ($i * 0.01),
                'dropoff_lat' => 47.52 + ($i * 0.01),
                'dropoff_long' => 19.06 + ($i * 0.01),
                'status' => 'completed',
                'price' => 12000 + ($i * 800),
            ]);
        }

        /** ================= PAYMENTS (60) ================= */
        $paymentMethods = ['card', 'cash'];

        foreach ($towModels as $i => $tow) {
            for ($k = 0; $k < 3; $k++) {
                $user = $userModels[$k % count($userModels)];
                $towRequest = $requests[$i % count($requests)];

                Payment::create([
                    'price' => $towRequest->price,
                    'user' => $user->id,
                    'tow_user' => $tow->id,
                    'tow_request' => $towRequest->id,
                    'payment_method' => $paymentMethods[array_rand($paymentMethods)],
                ]);
            }
        }

        /** ================= RATINGS (60) ================= */
        $ratingComments = [
            'Gyors és megbízható segítség.',
            'Nagyon kedves és profi.',
            'Ajánlom mindenkinek.',
            'Rugalmas és precíz.',
            'Nagyon jó kommunikáció.'
        ];

        foreach ($towModels as $i => $tow) {
            for ($k = 0; $k < 3; $k++) {
                Rating::create([
                    'user' => $userModels[$k % count($userModels)]->id,
                    'tow_user' => $tow->id,
                    'tow_request' => $requests[$i % count($requests)]->id,
                    'rating' => rand(3, 5),
                    'text' => $ratingComments[array_rand($ratingComments)],
                ]);
            }

            $tow->refreshRating();
        }
    }
}
