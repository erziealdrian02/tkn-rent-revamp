/* ============================================================
   Surat Jalan Pemulangan per PROYEK (dipakai di Proyek & Rekap PO)
   Jemput dari stok proyek sekaligus dalam satu SJ; sistem membagi qty ke PO (yang paling lama dulu).
   ============================================================ */
function canProjectPickup(projectId) {
  return canDo('Deliveries', 'Create') && BizLogic.Delivery.projectPickupRemaining(projectId).some(function(x) { return x.remaining > 0; });
}

function openProjectPickup(projectId, opts) {
  opts = opts || {};
  var D = BizLogic.Delivery, project = MockData.projects.find(function(p) { return p.id === projectId; });
  var rem = D.projectPickupRemaining(projectId);
  if (!rem.some(function(r) { return r.remaining > 0; })) { showToast('Tidak ada alat di proyek yang bisa dijemput', 'warning'); return; }
  var esc = function(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); };
  var today = new Date().toISOString().split('T')[0];
  var old = document.getElementById('projectPickupModal');
  if (old) old.remove();
  var opt = function(list, label) { return '<option value="">- ' + label + ' -</option>' + list; };
  var html = '<div class="modal fade" id="projectPickupModal" tabindex="-1"><div class="modal-dialog modal-lg"><div class="modal-content">' +
    '<div class="modal-header"><h5 class="modal-title"><i class="bi bi-box-arrow-in-left me-2"></i>Surat Jalan Pemulangan · ' + esc(project.name) + '</h5><button class="btn-close" data-bs-dismiss="modal"></button></div>' +
    '<div class="modal-body">' +
    '<div class="alert alert-light border py-2 fs-13 mb-3">Jemput alat dari <b>stok proyek</b> dalam satu surat jalan, tidak perlu per PO. Sistem otomatis membagi qty ke PO yang paling lama dulu. ' +
    'Setelah tiba di gudang alat diinspeksi: baik / rusak / hilang. Kalau yang datang <b>lebih</b> dari stok proyek, catat kelebihannya di kolom <b>Lebih</b> saat inspeksi (adjustment).</div>' +
    '<div class="row g-3 mb-3">' +
    '<div class="col-md-4"><label class="form-label form-label-er">Tanggal Jemput</label><input type="date" class="form-control" id="ppDate" value="' + (opts.date && opts.date > today ? opts.date : today) + '"></div>' +
    '<div class="col-md-4"><label class="form-label form-label-er">Gudang Tujuan</label><select class="form-select" id="ppBranch">' + MockData.branches.map(function(b) { return '<option value="' + b.id + '"' + (b.id === opts.branchId ? ' selected' : '') + '>' + esc(b.name) + '</option>'; }).join('') + '</select></div>' +
    '<div class="col-md-4"><label class="form-label form-label-er">Driver</label><select class="form-select" id="ppDriver">' + opt(MockData.drivers.filter(function(d) { return d.status === 'Available'; }).map(function(d) { return '<option value="' + d.id + '" data-name="' + esc(d.name) + '">' + esc(d.name) + '</option>'; }).join(''), 'Pilih nanti') + '</select></div>' +
    '<div class="col-md-4"><label class="form-label form-label-er">Kendaraan</label><select class="form-select" id="ppVehicle">' + opt(MockData.vehicles.filter(function(v) { return v.status === 'Available'; }).map(function(v) { return '<option value="' + v.id + '" data-plate="' + esc(v.plate) + '">' + esc(v.plate + ' - ' + v.brand) + '</option>'; }).join(''), 'Pilih nanti') + '</select></div>' +
    '<div class="col-md-4"><label class="form-label form-label-er">Estimasi Berangkat</label><input type="datetime-local" class="form-control" id="ppEstDepart"></div>' +
    '<div class="col-md-4"><label class="form-label form-label-er">Estimasi Tiba di Gudang</label><input type="datetime-local" class="form-control" id="ppEstArrive"></div>' +
    '</div>' +
    '<div class="er-table-wrapper"><table class="er-table"><thead><tr><th>Alat</th><th class="num">Di Proyek</th><th class="num">Sedang Dipulangkan</th><th class="num">Bisa Dijemput</th><th style="width:110px">Jemput</th></tr></thead><tbody>' +
    rem.map(function(r) {
      return '<tr><td class="fw-600">' + esc(r.name) + '</td><td class="num">' + r.onSite + '</td><td class="num">' + (r.pending || '-') + '</td><td class="num fw-600">' + r.remaining + '</td>' +
        '<td><input type="number" class="form-control form-control-sm text-end pp-qty" min="0" max="' + r.remaining + '" value="' + r.remaining + '" data-name="' + esc(r.name) + '"' + (r.remaining ? '' : ' disabled') + '></td></tr>';
    }).join('') + '</tbody></table></div>' +
    '<div class="mt-3"><label class="form-label form-label-er">Catatan</label><textarea class="form-control" rows="2" id="ppNotes"></textarea></div>' +
    '</div><div class="modal-footer"><button class="btn btn-outline-secondary" data-bs-dismiss="modal">Batal</button>' +
    '<button class="btn btn-primary" id="ppSubmit"><i class="bi bi-check-lg me-1"></i>Buat Surat Jalan Pemulangan</button></div></div></div></div>';
  document.body.insertAdjacentHTML('beforeend', html);
  var el = document.getElementById('projectPickupModal'), modal = new bootstrap.Modal(el);
  document.getElementById('ppSubmit').addEventListener('click', function() {
    var items = Array.prototype.map.call(el.querySelectorAll('.pp-qty'), function(i) { return { name: i.dataset.name, qty: parseInt(i.value, 10) || 0 }; });
    var drv = document.getElementById('ppDriver'), veh = document.getElementById('ppVehicle');
    var res = D.createProjectPickup(projectId, items, {
      deliveryDate: document.getElementById('ppDate').value, branchId: document.getElementById('ppBranch').value,
      driverId: drv.value || null, driverName: drv.value ? drv.selectedOptions[0].dataset.name : null,
      vehicleId: veh.value || null, vehiclePlate: veh.value ? veh.selectedOptions[0].dataset.plate : null,
      notes: document.getElementById('ppNotes').value,
      estimateDepart: document.getElementById('ppEstDepart').value.replace('T', ' '),
      estimateArrive: document.getElementById('ppEstArrive').value.replace('T', ' ')
    });
    if (!res.success) { showToast(res.error, 'error'); return; }
    modal.hide();
    showToast('Surat jalan pemulangan ' + res.delivery.sjNo + ' dibuat', 'success');
    setTimeout(function() { location.href = 'delivery-detail.html?id=' + res.delivery.id; }, 700);
  });
  el.addEventListener('hidden.bs.modal', function() { el.remove(); });
  modal.show();
}
