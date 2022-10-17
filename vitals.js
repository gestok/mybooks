document.addEventListener('DOMContentLoaded', async () => {
  const vitals = document.getElementById('vitals');
  let logged = false;
  if (localStorage.getItem('isAuth')) {
    const storage = JSON.parse(localStorage.getItem('isAuth'));
    if (storage.name) logged = true;
  }

  if (logged) {
    const profile = document.createElement('div');
    profile.id = 'profile';
    profile.classList.add(
      'd-flex',
      'gap-sm',
      'justify-content-space-between',
      'align-items-center'
    );
    profile.innerHTML = `
      <div class="details d-flex flex-column">
        <span>${JSON.parse(localStorage.getItem('isAuth')).name}</span>
        <button class="logout" onclick="logOut()">Logout</button>
      </div>
      <div class="d-flex relative">
        <img class="pe-none user-select-none" src="${
          JSON.parse(localStorage.getItem('isAuth')).avatar ||
          'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEAAAABACAMAAACdt4HsAAAAAXNSR0IArs4c6QAAAR1QTFRFAAAAgICA////tra22///s7Oz5vLy8vLysq2ysrKy6+vr8Ovrsra2sra5srm26u7usbG0sbS0tLS06ezssLW1s7W1s7W36uzssrW16evrsra26uvrsbO0sbS06e3ts7a2tLa26ezssrW16ezssrS0zNDQz9LSsrW1sra16uzssrW16ezssrW16ezss7W0s7W16ezssrW16ezssrS1srW0srW1s7S1s7W1s7a2tLe3tbi4trm5uby8u76+vL6/vL+/vsHBxsnJx8rKyczMy87Oy87PzM/PzdDQz9LS0NPT0NTU0tXU0tXV1tnZ19ra2dzc2t3d3N/f3uHh4OPj5ejo5unp5+rq6Ovr6Ozs6Ozt6O3s6evr6ezs6ezt6e3sL6qCYwAAADN0Uk5TAAICBwcUFBQyMjIySUlJSVxcXFxubm5ujo6Pj5qamqCgoMjI1NTU1tbW6en29vr6+v7+Q6sHUwAAA0hJREFUWMOVV31f0zAQzoCp0ylORMYQJi86GYVttKGdgE5B8aW+4LCbrt33/xj2LU1yl7Tl/hilvz6X5y6X5y6EaKxSa3aMAQ1tYLxu1irkVlZtH4VIyzRpZr0X1dLw1Z5NBSj3sVoK3rIklC08W7RVCG8oVmZ0Yl+NXPhilxZad1GPr2swNosgsYc6/CYtaZtq/I4UtQkzKNqOCr+nz17oCbjay18/tVP3xg/t5ttpCQ44/pEXoYMg+vVGchpxHnD+x75kYxRaXdp/Md7IhpNAdhBMhnxXk0/FeoD148SgeYL9l/pwQBRdjn8MC8eTV0/+eDBKXtXyllHqcnDCYhr/uqaURkqz8wfwjq8xB1BoCQROhAQnBP5iBy4MItUP8dRERGZZ7HPZwYyCGBKF6XG9kCKYFsfQi/UPnpkR3gBmI6maQraRTrZhYBecOSRxAc4YbYcOjqCDK4jmmbgS9TGNoRJFYMsMdAQYAyGXFVJDqjHSlUEg5iBdtUaaSHecQIWeS7uQbWaTdLBYTKLkBxg/nWHJ6hADO3Al6FRZiYy1QQZyddlZJQV86QDWEd/HAVGJrqtKwFw6CtmahLsUcump0ugpeyaJ0TaQNEd3mHHTJupGPJzAMmSaaAO2cRKpFJxZrMpUSKKh6+dhX5gzBqwv4F5n8EKytJ3JBZ3pRHjuhKVsKfuhmdeeM4jZDA9T4VfctyWuEi9xLzrOmo4MX1iqDyqpJNp4K88/j9N68sZf3lL15NVTSVosKn+gmniXDmNhcx7tRFQzZgnL4TXSsth+v0EBVpmsWwK3777WfqpknTyV3p2F3OdMwrA2nUu79Ezoram9V7UDUVgupaMoNNfEPvl5Fvv9ipsrp/BBNRfAfz5m6crmgydpds+yD+PZaqoh8i7FN+CIY/sFxtKLRpx4yKL0Rz6Y2y80ZJF6GMLQL+UgIhFWFH0kD4rPKb1WVZ+mJqm5iUfd9MOptGAgobMnRzFuv/S1NYRZvFKN67u+vgqAq131hWFLt/Pw9ZbuyrKcj2eclvWXpqUDEK+C0sFS7r1tpegsrRTeHDd4rnAeN0rdXdf66v3or5W+Pd/d7iP09p3bXeAX7q/vHx5H0OPD/fUHC7rv/gMlCGSjPz60BgAAAABJRU5ErkJggg=='
        }" alt="Avatar" />
      </div>
    `;

    vitals.append(profile);
  } else {
    vitals.innerHTML = `
      <button class="btn primary" onclick="login()">Login</button>
      <button class="btn secondary" onclick="register()">Register</button>
    `;
  }
});
