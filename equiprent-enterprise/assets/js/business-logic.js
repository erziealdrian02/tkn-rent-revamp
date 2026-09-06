/* ============================================================
   EquipRent Enterprise — Business Logic Engine
   Centralized state transitions, stock management, validation
   ============================================================ */

const BizLogic = {};

// ============================================================
// STATUS STATE MACHINES
// ============================================================

BizLogic.RentalStatus = {
  DRAFT: 'Draft',
  PENDING: 'Pending Approval',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  PREPARING: 'Preparing',
  PARTIALLY_DELIVERED: 'Partially Delivered',
  ON_RENTAL: 'On Rental',
  PARTIALLY_RETURNED: 'Partially Returned',
  RETURN_PENDING: 'Return Pending',
  OVERDUE: 'Overdue',
  COMPLETED: 'Completed',
  CANCELLED: 'Cancelled'
};

BizLogic.RentalTransitions = {
  'Draft':               ['Pending Approval', 'Cancelled'],
  'Pending Approval':    ['Approved', 'Rejected', 'Cancelled'],
  'Approved':            ['Preparing', 'Cancelled'],
  'Rejected':            ['Pending Approval'],
  'Preparing':           ['Partially Delivered', 'On Rental'],
  'Partially Delivered': ['On Rental'],
  'On Rental':           ['Partially Returned', 'Return Pending', 'Overdue', 'Completed'],
  'Overdue':             ['Partially Returned', 'Return Pending', 'Completed'],
  'Partially Returned':  ['Completed'],
  'Return Pending':      ['Completed'],
  'Completed':           [],
  'Cancelled':           []
};

BizLogic.DeliveryTransitions = {
  'Preparing':   ['Assigned'],
  'Assigned':    ['Departed'],
  'Departed':    ['Arrived', 'Failed'],
  'Arrived':     ['Completed'],
  'Failed':      ['Rescheduled'],
  'Rescheduled': ['Assigned'],
  'Completed':   []
};

BizLogic.PurchaseTransitions = {
  'Draft':      ['Ordered', 'Cancelled'],
  'Ordered':    ['Approved', 'Cancelled'],
  'Approved':   ['In Transit', 'Cancelled'],
  'In Transit': ['Arrived', 'Partially Received'],
  'Arrived':    ['Partially Received', 'Received'],
  'Partially Received': ['Received'],
  'Received':   ['Completed'],
  'Completed':  [],
  'Cancelled':  []
};

BizLogic.ClaimTransitions = {
  'Draft':                          ['Pending Customer Confirmation'],
  'Pending Customer Confirmation':  ['Approved', 'Disputed'],
  'Waiting Customer Confirmation':  ['Approved', 'Disputed'],
  'Approved':                       ['Invoiced'],
  'Disputed':                       ['Approved', 'Closed'],
  'Invoiced':                       ['Paid', 'Closed'],
  'Paid':                           ['Closed'],
  'Closed':                         []
};

BizLogic.InvoiceTransitions = {
  'Draft':          ['Issued'],
  'Issued':         ['Sent', 'Partially Paid', 'Paid', 'Overdue', 'Cancelled'],
  'Sent':           ['Partially Paid', 'Paid', 'Overdue', 'Cancelled'],
  'Partially Paid': ['Paid', 'Overdue'],
  'Paid':           [],
  'Overdue':        ['Partially Paid', 'Paid'],
  'Cancelled':      []
};

BizLogic.RepairTransitions = {
  'Pending':      ['In Repair'],
  'In Repair':    ['Completed', 'Unrepairable'],
  'Completed':    [],
  'Unrepairable': []
};

// ============================================================
// TRANSITION VALIDATOR
// ============================================================

BizLogic.canTransition = function(transitionMap, currentStatus, targetStatus) {
  const allowed = transitionMap[currentStatus];
  if (!allowed) return false;
  return allowed.includes(targetStatus);
};

BizLogic.validateTransition = function(transitionMap, currentStatus, targetStatus) {
  if (!BizLogic.canTransition(transitionMap, currentStatus, targetStatus)) {
    console.error('Invalid transition: ' + currentStatus + ' → ' + targetStatus);
    return false;
  }
  return true;
};

// ============================================================
// STOCK MANAGER
// ============================================================

BizLogic.Stock = {
  find: function(equipmentName, branch) {
    const branchNorm = branch.replace(' Warehouse', '');
    return MockData.stock.find(function(s) {
      return s.equipment === equipmentName && (s.branch === branch || s.branch === branchNorm);
    });
  },

  getAvailable: function(equipmentName, branch) {
    var s = this.find(equipmentName, branch);
    return s ? s.available : 0;
  },

  reserve: function(equipmentName, branch, quantity) {
    var s = this.find(equipmentName, branch);
    if (!s) { console.error('Stock not found:', equipmentName, branch); return false; }
    if (s.available < quantity) {
      console.error('Insufficient available stock: ' + equipmentName + ' in ' + branch + '. Available: ' + s.available + ', Requested: ' + quantity);
      return false;
    }
    s.available -= quantity;
    s.reserved = (s.reserved || 0) + quantity;
    MockData.save('stock');
    return true;
  },

  release: function(equipmentName, branch, quantity) {
    var s = this.find(equipmentName, branch);
    if (!s) { console.error('Stock not found:', equipmentName, branch); return false; }
    var releaseQty = Math.min(quantity, s.reserved || 0);
    s.reserved = (s.reserved || 0) - releaseQty;
    s.available += releaseQty;
    MockData.save('stock');
    return true;
  },

  deliver: function(equipmentName, branch, quantity) {
    var s = this.find(equipmentName, branch);
    if (!s) return false;
    var fromReserved = Math.min(quantity, s.reserved || 0);
    var fromAvailable = quantity - fromReserved;
    if (fromAvailable > s.available) {
      console.error('Cannot deliver: insufficient stock for ' + equipmentName);
      return false;
    }
    s.reserved = (s.reserved || 0) - fromReserved;
    s.available -= fromAvailable;
    s.onRental = (s.onRental || 0) + quantity;
    MockData.save('stock');
    return true;
  },

  returnGood: function(equipmentName, branch, quantity) {
    var s = this.find(equipmentName, branch);
    if (!s) return false;
    s.onRental = Math.max(0, (s.onRental || 0) - quantity);
    s.available += quantity;
    MockData.save('stock');
    return true;
  },

  returnDamaged: function(equipmentName, branch, quantity) {
    var s = this.find(equipmentName, branch);
    if (!s) return false;
    s.onRental = Math.max(0, (s.onRental || 0) - quantity);
    s.damaged = (s.damaged || 0) + quantity;
    MockData.save('stock');
    return true;
  },

  returnLost: function(equipmentName, branch, quantity) {
    var s = this.find(equipmentName, branch);
    if (!s) return false;
    s.onRental = Math.max(0, (s.onRental || 0) - quantity);
    s.lost = (s.lost || 0) + quantity;
    MockData.save('stock');
    return true;
  },

  returnMissing: function(equipmentName, branch, quantity) {
    var s = this.find(equipmentName, branch);
    if (!s) return false;
    s.onRental = Math.max(0, (s.onRental || 0) - quantity);
    s.missing = (s.missing || 0) + quantity;
    MockData.save('stock');
    return true;
  },

  repairComplete: function(equipmentName, branch, quantity) {
    var s = this.find(equipmentName, branch);
    if (!s) return false;
    s.damaged = Math.max(0, (s.damaged || 0) - quantity);
    s.available += quantity;
    MockData.save('stock');
    return true;
  },

  stockIn: function(equipmentName, branch, quantity) {
    var s = this.find(equipmentName, branch);
    if (!s) {
      s = {
        equipment: equipmentName,
        branch: branch.replace(' Warehouse', ''),
        total: 0, available: 0, reserved: 0,
        onRental: 0, damaged: 0, maintenance: 0, lost: 0, missing: 0
      };
      MockData.stock.push(s);
    }
    s.total += quantity;
    s.available += quantity;
    MockData.save('stock');
    return true;
  },

  transfer: function(equipmentName, fromBranch, toBranch, quantity) {
    var src = this.find(equipmentName, fromBranch);
    if (!src || src.available < quantity) return false;
    src.available -= quantity;
    src.total -= quantity;

    var dest = this.find(equipmentName, toBranch);
    if (!dest) {
      dest = {
        equipment: equipmentName,
        branch: toBranch.replace(' Warehouse', ''),
        total: 0, available: 0, reserved: 0,
        onRental: 0, damaged: 0, maintenance: 0, lost: 0, missing: 0
      };
      MockData.stock.push(dest);
    }
    dest.available += quantity;
    dest.total += quantity;
    MockData.save('stock');
    return true;
  }
};

// ============================================================
// MOVEMENT LOG
// ============================================================

BizLogic.Movement = {
  create: function(type, equipment, quantity, from, to, reference, user) {
    var mov = {
      id: MockData.generateId('MOV', 'movements'),
      date: new Date().toISOString().split('T')[0],
      equipment: equipment,
      quantity: quantity,
      from: from,
      to: to,
      type: type,
      reference: reference,
      user: user || (JSON.parse(sessionStorage.getItem('er_user') || '{}').name || 'System'),
      status: 'Completed'
    };
    MockData.movements.push(mov);
    MockData.save('movements');
    return mov;
  }
};

// ============================================================
// NOTIFICATION MANAGER
// ============================================================

BizLogic.Notification = {
  add: function(message, type, icon, link) {
    var notif = {
      id: Date.now(),
      message: message,
      type: type || 'info',
      icon: icon || 'bi-info-circle',
      time: 'Just now',
      read: false,
      link: link || '#'
    };
    MockData.notifications.unshift(notif);
    if (MockData.notifications.length > 20) {
      MockData.notifications = MockData.notifications.slice(0, 20);
    }
    MockData.save('notifications');
    return notif;
  }
};

// ============================================================
// ACTIVITY LOG
// ============================================================

BizLogic.Activity = {
  log: function(action, type) {
    var now = new Date();
    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    var entry = {
      time: now.toTimeString().substring(0, 5),
      date: now.toISOString().split('T')[0],
      action: action,
      user: user.name || 'System',
      type: type || 'info'
    };
    MockData.activityLog.unshift(entry);
    if (MockData.activityLog.length > 50) {
      MockData.activityLog = MockData.activityLog.slice(0, 50);
    }
    MockData.save('activityLog');
    return entry;
  }
};

// ============================================================
// RENTAL OPERATIONS
// ============================================================

BizLogic.Rental = {
  submit: function(rentalId) {
    var rental = MockData.rentals.find(function(r) { return r.id === rentalId; });
    if (!rental) return { success: false, error: 'Rental not found' };

    if (!BizLogic.validateTransition(BizLogic.RentalTransitions, rental.status, 'Pending Approval')) {
      return { success: false, error: 'Cannot submit from status: ' + rental.status };
    }

    rental.status = 'Pending Approval';
    rental.submittedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    MockData.save('rentals');

    BizLogic.Activity.log('Rental ' + rentalId + ' submitted for approval', 'info');
    BizLogic.Notification.add(
      'Rental <strong>' + rentalId + '</strong> is waiting for approval',
      'warning', 'bi-clock-history',
      'rental-detail.html?id=' + rentalId
    );

    return { success: true };
  },

  approve: function(rentalId, approverNotes) {
    var rental = MockData.rentals.find(function(r) { return r.id === rentalId; });
    if (!rental) return { success: false, error: 'Rental not found' };

    var currentStatus = rental.status;
    // Allow approve from Pending Approval or Waiting Approval (legacy)
    if (currentStatus !== 'Pending Approval' && currentStatus !== 'Waiting Approval') {
      return { success: false, error: 'Cannot approve from status: ' + currentStatus };
    }

    var branch = rental.branch ? rental.branch.replace(' Warehouse', '') : 'Jakarta';
    var reservationErrors = [];

    rental.items.forEach(function(item) {
      var available = BizLogic.Stock.getAvailable(item.name, branch);
      if (available < item.quantity) {
        reservationErrors.push(item.name + ': need ' + item.quantity + ', only ' + available + ' available');
      }
    });

    if (reservationErrors.length > 0) {
      return { success: false, error: 'Insufficient stock:\n' + reservationErrors.join('\n') };
    }

    // Reserve all items
    rental.items.forEach(function(item) {
      BizLogic.Stock.reserve(item.name, branch, item.quantity);
      BizLogic.Movement.create('Reservation', item.name, item.quantity, branch + ' Warehouse', 'Reserved for ' + rentalId, rentalId);
    });

    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    rental.status = 'Approved';
    rental.approvedBy = user.name || 'Manager';
    rental.approvedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
    rental.approvalNotes = approverNotes || '';
    rental.deliveryStatus = 'Pending';
    MockData.save('rentals');

    BizLogic.Activity.log('Rental ' + rentalId + ' approved by ' + rental.approvedBy, 'success');
    BizLogic.Notification.add(
      'Rental <strong>' + rentalId + '</strong> has been approved',
      'green', 'bi-check-circle',
      'rental-detail.html?id=' + rentalId
    );

    return { success: true };
  },

  reject: function(rentalId, reason) {
    var rental = MockData.rentals.find(function(r) { return r.id === rentalId; });
    if (!rental) return { success: false, error: 'Rental not found' };

    if (rental.status !== 'Pending Approval' && rental.status !== 'Waiting Approval') {
      return { success: false, error: 'Cannot reject from status: ' + rental.status };
    }

    // Release any existing reservations
    var branch = rental.branch ? rental.branch.replace(' Warehouse', '') : 'Jakarta';
    rental.items.forEach(function(item) {
      BizLogic.Stock.release(item.name, branch, item.quantity);
    });

    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    rental.status = 'Rejected';
    rental.rejectedBy = user.name || 'Manager';
    rental.rejectedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
    rental.rejectionReason = reason || 'No reason provided';
    MockData.save('rentals');

    BizLogic.Activity.log('Rental ' + rentalId + ' rejected: ' + reason, 'danger');
    BizLogic.Notification.add(
      'Rental <strong>' + rentalId + '</strong> has been rejected',
      'red', 'bi-x-circle',
      'rental-detail.html?id=' + rentalId
    );

    return { success: true };
  },

  cancel: function(rentalId, reason) {
    var rental = MockData.rentals.find(function(r) { return r.id === rentalId; });
    if (!rental) return { success: false, error: 'Rental not found' };

    var cancellableStatuses = ['Draft', 'Pending Approval', 'Waiting Approval', 'Approved'];
    if (cancellableStatuses.indexOf(rental.status) === -1) {
      return { success: false, error: 'Cannot cancel from status: ' + rental.status + '. Only Draft, Pending Approval, or Approved rentals can be cancelled.' };
    }

    // Release any existing reservations if approved
    var branch = rental.branch ? rental.branch.replace(' Warehouse', '') : 'Jakarta';
    if (rental.status === 'Approved') {
      rental.items.forEach(function(item) {
        BizLogic.Stock.release(item.name, branch, item.quantity);
        BizLogic.Movement.create('Reservation Release', item.name, item.quantity, 'Reserved for ' + rentalId, branch + ' Warehouse', rentalId);
      });
    }

    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    rental.status = 'Cancelled';
    rental.cancelledBy = user.name || 'Admin';
    rental.cancelledDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
    rental.cancellationReason = reason || 'No reason provided';
    MockData.save('rentals');

    BizLogic.Activity.log('Rental ' + rentalId + ' cancelled: ' + reason, 'danger');
    BizLogic.Notification.add(
      'Rental <strong>' + rentalId + '</strong> has been cancelled',
      'red', 'bi-x-circle',
      'rental-detail.html?id=' + rentalId
    );

    return { success: true };
  },

  resubmit: function(rentalId) {
    var rental = MockData.rentals.find(function(r) { return r.id === rentalId; });
    if (!rental) return { success: false, error: 'Rental not found' };

    if (rental.status !== 'Rejected') {
      return { success: false, error: 'Only rejected rentals can be resubmitted' };
    }

    rental.status = 'Pending Approval';
    rental.rejectedBy = null;
    rental.rejectedDate = null;
    rental.rejectionReason = null;
    rental.resubmittedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    MockData.save('rentals');

    BizLogic.Activity.log('Rental ' + rentalId + ' resubmitted for approval', 'info');
    BizLogic.Notification.add(
      'Rental <strong>' + rentalId + '</strong> has been resubmitted for approval',
      'warning', 'bi-arrow-repeat',
      'rental-detail.html?id=' + rentalId
    );

    return { success: true };
  },

  isOverdue: function(rental) {
    if (['Completed', 'Cancelled', 'Rejected', 'Draft'].includes(rental.status)) return false;
    if (!rental.returnDate) return false;
    var today = new Date();
    today.setHours(0,0,0,0);
    var returnDate = new Date(rental.returnDate);
    returnDate.setHours(0,0,0,0);
    return today > returnDate && ['On Rental', 'Partially Returned', 'Overdue', 'Partially Delivered'].includes(rental.status);
  },

  getOverdueDays: function(rental) {
    if (!this.isOverdue(rental)) return 0;
    var today = new Date();
    today.setHours(0,0,0,0);
    var returnDate = new Date(rental.returnDate);
    returnDate.setHours(0,0,0,0);
    return Math.ceil((today - returnDate) / (1000 * 60 * 60 * 24));
  }
};

// ============================================================
// DELIVERY OPERATIONS
// ============================================================

BizLogic.Delivery = {
  create: function(rentalId, items, details) {
    var rental = MockData.rentals.find(function(r) { return r.id === rentalId; });
    if (!rental) return { success: false, error: 'Rental not found' };

    var allowedStatuses = ['Approved', 'Preparing', 'Partially Delivered', 'On Rental'];
    if (allowedStatuses.indexOf(rental.status) === -1) {
      return { success: false, error: 'Cannot create delivery for rental in status: ' + rental.status };
    }

    if (!items || items.length === 0) {
      return { success: false, error: 'At least one item is required' };
    }

    // Validate quantities against remaining delivery quantity
    var existingDeliveries = MockData.deliveries.filter(function(d) {
      return d.rentalId === rentalId && d.status !== 'Failed';
    });

    for (var idx = 0; idx < items.length; idx++) {
      var item = items[idx];
      var rentalItem = rental.items.find(function(ri) { return ri.name === item.name; });
      if (!rentalItem) return { success: false, error: 'Item ' + item.name + ' not found in rental' };

      var alreadyDelivered = existingDeliveries.reduce(function(sum, d) {
        var di = d.items.find(function(i) { return i.name === item.name; });
        return sum + (di ? di.qty : 0);
      }, 0);

      var remaining = rentalItem.quantity - alreadyDelivered;
      if (item.qty > remaining) {
        return { success: false, error: item.name + ': cannot deliver ' + item.qty + ', only ' + remaining + ' remaining' };
      }
    }

    var delivery = {
      id: MockData.generateId('DLV', 'deliveries'),
      rentalId: rentalId,
      projectId: rental.projectId,
      projectName: rental.projectName,
      customerId: rental.customerId,
      customerName: rental.customerName,
      driverId: details.driverId || null,
      driverName: details.driverName || null,
      vehicleId: details.vehicleId || null,
      vehiclePlate: details.vehiclePlate || null,
      deliveryDate: details.deliveryDate || new Date().toISOString().split('T')[0],
      destination: details.destination || '',
      status: details.driverId ? 'Assigned' : 'Preparing',
      notes: details.notes || '',
      items: items,
      proofOfDelivery: null,
      failureInfo: null
    };

    MockData.deliveries.push(delivery);
    MockData.save('deliveries');

    // Update rental status
    if (rental.status === 'Approved') {
      rental.status = 'Preparing';
      rental.deliveryStatus = 'Preparing';
      MockData.save('rentals');
    }

    // Update driver status if assigned
    if (details.driverId) {
      var driver = MockData.drivers.find(function(d) { return d.id === details.driverId; });
      if (driver) {
        driver.status = 'On Delivery';
        driver.currentDelivery = delivery.id;
        MockData.save('drivers');
      }
    }

    // Update vehicle status if assigned
    if (details.vehicleId) {
      var vehicle = MockData.vehicles.find(function(v) { return v.id === details.vehicleId; });
      if (vehicle) {
        vehicle.status = 'On Delivery';
        vehicle.currentDelivery = delivery.id;
        MockData.save('vehicles');
      }
    }

    BizLogic.Activity.log('Delivery ' + delivery.id + ' created for ' + rentalId, 'info');
    BizLogic.Notification.add(
      'Delivery <strong>' + delivery.id + '</strong> created for rental ' + rentalId,
      'info', 'bi-truck',
      'delivery-detail.html?id=' + delivery.id
    );

    return { success: true, delivery: delivery };
  },

  updateStatus: function(deliveryId, newStatus, extraData) {
    var delivery = MockData.deliveries.find(function(d) { return d.id === deliveryId; });
    if (!delivery) return { success: false, error: 'Delivery not found' };

    if (!BizLogic.validateTransition(BizLogic.DeliveryTransitions, delivery.status, newStatus)) {
      return { success: false, error: 'Cannot transition from ' + delivery.status + ' to ' + newStatus };
    }

    delivery.status = newStatus;

    if (newStatus === 'Departed') {
      delivery.departedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
    }

    if (newStatus === 'Arrived') {
      delivery.arrivedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      if (extraData && extraData.proofOfDelivery) {
        delivery.proofOfDelivery = extraData.proofOfDelivery;
      }
    }

    if (newStatus === 'Completed') {
      delivery.completedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);

      // Move stock: Reserved/Available → On Rental
      var rental = MockData.rentals.find(function(r) { return r.id === delivery.rentalId; });
      if (rental) {
        var branch = rental.branch ? rental.branch.replace(' Warehouse', '') : 'Jakarta';
        delivery.items.forEach(function(item) {
          BizLogic.Stock.deliver(item.name, branch, item.qty);
          BizLogic.Movement.create('Rental Out', item.name, item.qty, branch + ' Warehouse', delivery.destination || rental.projectName, delivery.id);
        });

        // Check if all items delivered
        BizLogic.Delivery._updateRentalDeliveryStatus(rental);
      }

      // Release driver and vehicle
      BizLogic.Delivery._releaseDriverVehicle(delivery);
    }

    if (newStatus === 'Failed') {
      delivery.failureInfo = extraData || {};
      delivery.failedAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      BizLogic.Delivery._releaseDriverVehicle(delivery);

      BizLogic.Notification.add(
        'Delivery <strong>' + deliveryId + '</strong> has failed: ' + ((extraData && extraData.reason) || 'Unknown'),
        'red', 'bi-exclamation-triangle',
        'delivery-detail.html?id=' + deliveryId
      );
    }

    if (newStatus === 'Rescheduled') {
      delivery.rescheduledAt = new Date().toISOString().replace('T', ' ').substring(0, 16);
      if (extraData && extraData.newDate) {
        delivery.deliveryDate = extraData.newDate;
      }
    }

    MockData.save('deliveries');
    BizLogic.Activity.log('Delivery ' + deliveryId + ' status changed to ' + newStatus, newStatus === 'Failed' ? 'danger' : 'info');

    return { success: true };
  },

  _releaseDriverVehicle: function(delivery) {
    if (delivery.driverId) {
      var driver = MockData.drivers.find(function(d) { return d.id === delivery.driverId; });
      if (driver) {
        driver.status = 'Available';
        driver.currentDelivery = null;
        MockData.save('drivers');
      }
    }
    if (delivery.vehicleId) {
      var vehicle = MockData.vehicles.find(function(v) { return v.id === delivery.vehicleId; });
      if (vehicle) {
        vehicle.status = 'Available';
        vehicle.currentDelivery = null;
        MockData.save('vehicles');
      }
    }
  },

  _updateRentalDeliveryStatus: function(rental) {
    var deliveries = MockData.deliveries.filter(function(d) {
      return d.rentalId === rental.id && ['Completed','Arrived'].indexOf(d.status) === -1 ? false : true;
    }).filter(function(d) { return d.status === 'Completed' || d.status === 'Arrived'; });

    var completedDeliveries = MockData.deliveries.filter(function(d) {
      return d.rentalId === rental.id && d.status === 'Completed';
    });

    rental.items.forEach(function(rentalItem) {
      var totalDelivered = completedDeliveries.reduce(function(sum, d) {
        var di = d.items.find(function(i) { return i.name === rentalItem.name; });
        return sum + (di ? di.qty : 0);
      }, 0);
      rentalItem.delivered = totalDelivered;
    });

    var allDelivered = rental.items.every(function(i) { return (i.delivered || 0) >= i.quantity; });
    var someDelivered = rental.items.some(function(i) { return (i.delivered || 0) > 0; });

    if (allDelivered) {
      rental.status = 'On Rental';
      rental.deliveryStatus = 'Completed';
    } else if (someDelivered) {
      rental.status = 'Partially Delivered';
      rental.deliveryStatus = 'Partial';
    }

    MockData.save('rentals');
  }
};

// ============================================================
// RETURN OPERATIONS
// ============================================================

BizLogic.Return = {
  completeInspection: function(returnId, classifiedItems) {
    var ret = MockData.returns.find(function(r) { return r.id === returnId; });
    if (!ret) return { success: false, error: 'Return not found' };

    if (ret.status === 'Completed') {
      return { success: false, error: 'Return is already completed' };
    }

    var rental = MockData.rentals.find(function(r) { return r.id === ret.rentalId; });
    var branch = rental ? (rental.branch ? rental.branch.replace(' Warehouse', '') : 'Jakarta') : 'Jakarta';

    for (var i = 0; i < ret.items.length; i++) {
      var item = ret.items[i];
      var classified = classifiedItems[i];
      var total = classified.good + classified.damaged + classified.lost + classified.missing;

      if (total !== item.sent) {
        return { success: false, error: item.name + ': classified total (' + total + ') does not match sent (' + item.sent + ')' };
      }

      item.good = classified.good;
      item.damaged = classified.damaged;
      item.lost = classified.lost;
      item.missing = classified.missing;
      item.damageNotes = classified.damageNotes || '';

      // Update stock
      if (classified.good > 0) {
        BizLogic.Stock.returnGood(item.name, branch, classified.good);
        BizLogic.Movement.create('Return', item.name, classified.good, ret.projectName || 'Project', branch + ' Warehouse', ret.id);
      }
      if (classified.damaged > 0) {
        BizLogic.Stock.returnDamaged(item.name, branch, classified.damaged);
        BizLogic.Movement.create('Return (Damaged)', item.name, classified.damaged, ret.projectName || 'Project', branch + ' Warehouse (Damaged)', ret.id);

        // Create repair record
        if (!MockData.repairs) MockData.repairs = [];
        var repair = {
          id: MockData.generateId('REP', 'repairs'),
          equipmentName: item.name,
          quantity: classified.damaged,
          sourceReturn: ret.id,
          sourceRental: ret.rentalId,
          branch: branch,
          problem: classified.damageNotes || 'Damage reported during return inspection',
          status: 'Pending',
          startDate: null,
          completionDate: null,
          notes: '',
          createdDate: new Date().toISOString().split('T')[0]
        };
        MockData.repairs.push(repair);
        MockData.save('repairs');
      }
      if (classified.lost > 0) {
        BizLogic.Stock.returnLost(item.name, branch, classified.lost);
        BizLogic.Movement.create('Lost', item.name, classified.lost, ret.projectName || 'Project', 'Lost', ret.id);
      }
      if (classified.missing > 0) {
        BizLogic.Stock.returnMissing(item.name, branch, classified.missing);
      }
    }

    var user = JSON.parse(sessionStorage.getItem('er_user') || '{}');
    ret.status = 'Completed';
    ret.inspectedBy = user.name || 'Warehouse Staff';
    ret.completedDate = new Date().toISOString().replace('T', ' ').substring(0, 16);
    MockData.save('returns');

    // Check if rental should be completed
    if (rental) {
      BizLogic.Return._updateRentalReturnStatus(rental);
    }

    BizLogic.Activity.log('Return ' + returnId + ' inspection completed', 'success');

    return { success: true };
  },

  _updateRentalReturnStatus: function(rental) {
    var returns = MockData.returns.filter(function(r) {
      return r.rentalId === rental.id && r.status === 'Completed';
    });

    rental.items.forEach(function(rentalItem) {
      var totalReturned = returns.reduce(function(sum, r) {
        return sum + r.items.reduce(function(isum, ri) {
          if (ri.name === rentalItem.name) {
            return isum + ri.sent;
          }
          return isum;
        }, 0);
      }, 0);
      rentalItem.returned = totalReturned;
    });

    var allReturned = rental.items.every(function(i) { return (i.returned || 0) >= i.quantity; });
    var someReturned = rental.items.some(function(i) { return (i.returned || 0) > 0; });

    if (allReturned) {
      rental.status = 'Completed';
    } else if (someReturned) {
      rental.status = 'Partially Returned';
    }

    MockData.save('rentals');
  }
};

// ============================================================
// REUSABLE CONFIRMATION MODAL
// ============================================================

BizLogic.showConfirmModal = function(title, message, confirmText, confirmClass, onConfirm, extraFields) {
  var existing = document.getElementById('bizConfirmModal');
  if (existing) existing.remove();

  var fieldsHtml = '';
  if (extraFields) {
    extraFields.forEach(function(f) {
      if (f.type === 'textarea') {
        fieldsHtml += '<div class="mb-3"><label class="form-label form-label-er">' + f.label + (f.required ? ' <span class="text-danger">*</span>' : '') + '</label><textarea class="form-control" id="confirmField_' + f.id + '" rows="' + (f.rows || 2) + '" placeholder="' + (f.placeholder || '') + '"' + (f.required ? ' required' : '') + '></textarea></div>';
      } else if (f.type === 'select') {
        var opts = f.options.map(function(o) { return '<option value="' + o.value + '">' + o.label + '</option>'; }).join('');
        fieldsHtml += '<div class="mb-3"><label class="form-label form-label-er">' + f.label + '</label><select class="form-select" id="confirmField_' + f.id + '">' + opts + '</select></div>';
      } else if (f.type === 'date') {
        fieldsHtml += '<div class="mb-3"><label class="form-label form-label-er">' + f.label + '</label><input type="date" class="form-control" id="confirmField_' + f.id + '" value="' + (f.value || new Date().toISOString().split('T')[0]) + '"></div>';
      } else {
        fieldsHtml += '<div class="mb-3"><label class="form-label form-label-er">' + f.label + '</label><input type="' + (f.type || 'text') + '" class="form-control" id="confirmField_' + f.id + '" value="' + (f.value || '') + '" placeholder="' + (f.placeholder || '') + '"></div>';
      }
    });
  }

  var modalHtml = '<div class="modal fade" id="bizConfirmModal" tabindex="-1"><div class="modal-dialog"><div class="modal-content"><div class="modal-header"><h5 class="modal-title">' + title + '</h5><button type="button" class="btn-close" data-bs-dismiss="modal"></button></div><div class="modal-body"><p>' + message + '</p>' + fieldsHtml + '</div><div class="modal-footer"><button type="button" class="btn btn-outline-secondary" data-bs-dismiss="modal">Cancel</button><button type="button" class="btn ' + (confirmClass || 'btn-primary') + '" id="bizConfirmBtn">' + (confirmText || 'Confirm') + '</button></div></div></div></div>';

  document.body.insertAdjacentHTML('beforeend', modalHtml);
  var modal = new bootstrap.Modal(document.getElementById('bizConfirmModal'));

  document.getElementById('bizConfirmBtn').addEventListener('click', function() {
    var fieldValues = {};
    if (extraFields) {
      var isValid = true;
      extraFields.forEach(function(f) {
        var el = document.getElementById('confirmField_' + f.id);
        fieldValues[f.id] = el ? el.value : '';
        if (f.required && !fieldValues[f.id].trim()) {
          el.classList.add('is-invalid');
          isValid = false;
        }
      });
      if (!isValid) return;
    }
    modal.hide();
    if (onConfirm) onConfirm(fieldValues);
  });

  document.getElementById('bizConfirmModal').addEventListener('hidden.bs.modal', function() {
    this.remove();
  });

  modal.show();
};
// ============================================================
// REPAIR OPERATIONS
// ============================================================

BizLogic.Repair = {
  updateStatus: function(repairId, newStatus, extraData) {
    var repair = MockData.repairs.find(function(r) { return r.id === repairId; });
    if (!repair) return { success: false, error: 'Repair not found' };

    if (!BizLogic.validateTransition(BizLogic.RepairTransitions, repair.status, newStatus)) {
      return { success: false, error: 'Cannot transition from ' + repair.status + ' to ' + newStatus };
    }

    repair.status = newStatus;
    
    if (newStatus === 'In Repair') {
      repair.startDate = new Date().toISOString().split('T')[0];
    }
    
    if (newStatus === 'Completed' || newStatus === 'Unrepairable') {
      repair.completionDate = new Date().toISOString().split('T')[0];
      if (extraData && extraData.notes) {
        repair.notes = extraData.notes;
      }
    }

    if (newStatus === 'Completed') {
      BizLogic.Stock.repairComplete(repair.equipmentName, repair.branch, repair.quantity);
      BizLogic.Movement.create('Repair Completed', repair.equipmentName, repair.quantity, repair.branch + ' Warehouse (Damaged)', repair.branch + ' Warehouse', repair.id);
    }
    
    if (newStatus === 'Unrepairable') {
      // It's removed from damaged, but not added to available
      var s = BizLogic.Stock.find(repair.equipmentName, repair.branch);
      if (s) {
        s.damaged = Math.max(0, (s.damaged || 0) - repair.quantity);
        s.total = Math.max(0, (s.total || 0) - repair.quantity);
        MockData.save('stock');
      }
      BizLogic.Movement.create('Disposal', repair.equipmentName, repair.quantity, repair.branch + ' Warehouse (Damaged)', 'Disposed', repair.id);
    }

    MockData.save('repairs');
    BizLogic.Activity.log('Repair ' + repair.id + ' status changed to ' + newStatus, newStatus === 'Unrepairable' ? 'danger' : 'info');
    return { success: true };
  }
};

// ============================================================
// CLAIM OPERATIONS
// ============================================================

BizLogic.Claim = {
  updateStatus: function(claimId, newStatus, extraData) {
    var claim = MockData.claims.find(function(c) { return c.id === claimId; });
    if (!claim) return { success: false, error: 'Claim not found' };

    if (!BizLogic.validateTransition(BizLogic.ClaimTransitions, claim.status, newStatus)) {
      return { success: false, error: 'Cannot transition from ' + claim.status + ' to ' + newStatus };
    }

    claim.status = newStatus;
    
    if (newStatus === 'Disputed') {
      claim.disputeReason = (extraData && extraData.reason) || 'Customer disputed claim amount';
    }
    
    if (newStatus === 'Invoiced') {
      // Create invoice for claim
      var invoice = {
        id: MockData.generateId('INV', 'invoices'),
        type: 'Claim',
        referenceId: claim.id,
        customerId: claim.customerId,
        customerName: claim.customerName,
        date: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + 14*24*60*60*1000).toISOString().split('T')[0],
        totalAmount: claim.claimAmount,
        paidAmount: 0,
        status: 'Issued'
      };
      if(!MockData.invoices) MockData.invoices = [];
      MockData.invoices.push(invoice);
      MockData.save('invoices');
      
      claim.invoiceId = invoice.id;
    }

    MockData.save('claims');
    BizLogic.Activity.log('Claim ' + claim.id + ' status changed to ' + newStatus, 'warning');
    return { success: true };
  }
};

// ============================================================
// PURCHASE & GOODS RECEIPT OPERATIONS
// ============================================================

BizLogic.Purchase = {
  createGoodsReceipt: function(purchaseId, receivedItems, details) {
    var po = MockData.purchases.find(function(p) { return p.id === purchaseId; });
    if (!po) return { success: false, error: 'Purchase Order not found' };

    var allowedStatuses = ['Ordered', 'Approved', 'In Transit', 'Arrived', 'Partially Received'];
    if (allowedStatuses.indexOf(po.status) === -1) {
      return { success: false, error: 'Cannot receive items for PO in status: ' + po.status };
    }

    var gr = {
      id: MockData.generateId('GR', 'goodsReceipts'),
      purchaseId: po.id,
      vendor: po.vendor,
      branch: details.branch || 'Jakarta Warehouse',
      receiptDate: details.receiptDate || new Date().toISOString().split('T')[0],
      receivedBy: details.receivedBy || JSON.parse(sessionStorage.getItem('er_user') || '{}').name || 'Warehouse Staff',
      notes: details.notes || '',
      items: receivedItems,
      status: 'Completed'
    };

    if (!MockData.goodsReceipts) MockData.goodsReceipts = [];
    MockData.goodsReceipts.push(gr);
    MockData.save('goodsReceipts');

    // Update PO and Stock
    var allReceived = true;
    var anyReceived = false;

    po.items.forEach(function(poItem) {
      var recvItem = receivedItems.find(function(ri) { return ri.name === poItem.name; });
      if (recvItem && recvItem.qty > 0) {
        poItem.received = (poItem.received || 0) + recvItem.qty;
        BizLogic.Stock.stockIn(poItem.name, gr.branch, recvItem.qty);
        BizLogic.Movement.create('Goods Receipt', poItem.name, recvItem.qty, po.vendor, gr.branch, gr.id);
        anyReceived = true;
      }
      if ((poItem.received || 0) < poItem.qty) {
        allReceived = false;
      }
    });

    if (allReceived) {
      po.status = 'Received';
    } else if (anyReceived) {
      po.status = 'Partially Received';
    }

    MockData.save('purchases');
    BizLogic.Activity.log('Goods Receipt ' + gr.id + ' created for PO ' + po.id, 'success');

    return { success: true, goodsReceipt: gr };
  }
};

// ============================================================
// INVOICE & PAYMENT OPERATIONS
// ============================================================

BizLogic.Invoice = {
  recordPayment: function(invoiceId, paymentAmount, paymentMethod, bankAccountId, notes) {
    var inv = MockData.invoices.find(function(i) { return i.id === invoiceId; });
    if (!inv) return { success: false, error: 'Invoice not found' };

    var allowed = ['Issued', 'Sent', 'Partially Paid', 'Overdue'];
    if (allowed.indexOf(inv.status) === -1) {
      return { success: false, error: 'Cannot record payment for invoice in status: ' + inv.status };
    }

    var amt = Number(paymentAmount);
    if (isNaN(amt) || amt <= 0) return { success: false, error: 'Invalid payment amount' };

    var remaining = inv.totalAmount - (inv.paidAmount || 0);
    if (amt > remaining) return { success: false, error: 'Payment amount exceeds remaining balance' };

    inv.paidAmount = (inv.paidAmount || 0) + amt;

    if (inv.paidAmount >= inv.totalAmount) {
      inv.status = 'Paid';
    } else {
      inv.status = 'Partially Paid';
    }

    MockData.save('invoices');

    // Create Ledger Entry
    if (!MockData.ledger) MockData.ledger = [];
    var entry = {
      id: MockData.generateId('TRX', 'ledger'),
      date: new Date().toISOString().split('T')[0],
      bankAccountId: bankAccountId || 'BA-001',
      reference: inv.id,
      description: 'Payment from ' + (inv.customerName || 'Customer') + ' - ' + (notes || ''),
      type: 'IN', // Cash IN
      amount: amt
    };
    MockData.ledger.push(entry);
    MockData.save('ledger');

    BizLogic.Activity.log('Payment of ' + amt + ' recorded for Invoice ' + inv.id, 'success');
    return { success: true };
  }
};

// ============================================================
// STOCK TRANSFER OPERATIONS
// ============================================================

BizLogic.StockTransfer = {
  create: function(sourceBranch, destBranch, equipmentName, qty, notes) {
    if (sourceBranch === destBranch) {
      return { success: false, error: 'Source and destination branches must be different' };
    }
    var q = Number(qty);
    if (isNaN(q) || q <= 0) return { success: false, error: 'Invalid quantity' };

    var stock = BizLogic.Stock.find(equipmentName, sourceBranch);
    if (!stock || stock.available < q) {
      return { success: false, error: 'Insufficient stock in ' + sourceBranch };
    }

    // Deduct from source
    BizLogic.Stock.stockOut(equipmentName, sourceBranch, q);
    
    // Add to destination
    BizLogic.Stock.stockIn(equipmentName, destBranch, q);

    var transferId = MockData.generateId('TRF', 'movements'); // Use TRF prefix for transfers
    
    // Log movements for both sides
    BizLogic.Movement.create('Transfer Out', equipmentName, q, destBranch, sourceBranch, transferId);
    BizLogic.Movement.create('Transfer In', equipmentName, q, sourceBranch, destBranch, transferId);

    BizLogic.Activity.log('Transferred ' + q + 'x ' + equipmentName + ' from ' + sourceBranch + ' to ' + destBranch, 'info');

    return { success: true, transferId: transferId };
  }
};

// ============================================================
// MAINTENANCE OPERATIONS
// ============================================================

BizLogic.Maintenance = {
  create: function(equipmentName, branch, qty, type, notes) {
    var q = Number(qty);
    if (isNaN(q) || q <= 0) return { success: false, error: 'Invalid quantity' };

    var stock = BizLogic.Stock.find(equipmentName, branch);
    if (!stock || stock.available < q) {
      return { success: false, error: 'Insufficient available stock for maintenance in ' + branch };
    }

    // Deduct from available, add to maintenance
    BizLogic.Stock.stockOut(equipmentName, branch, q);
    stock.maintenance = (stock.maintenance || 0) + q;
    MockData.save('stock');

    var mt = {
      id: MockData.generateId('MT', 'maintenance'),
      equipment: equipmentName,
      branch: branch,
      quantity: q,
      type: type || 'Routine Check',
      status: 'In Progress',
      startDate: new Date().toISOString().split('T')[0],
      completionDate: null,
      notes: notes || '',
      technician: JSON.parse(sessionStorage.getItem('er_user') || '{}').name || 'Technician'
    };

    if (!MockData.maintenance) MockData.maintenance = [];
    MockData.maintenance.push(mt);
    MockData.save('maintenance');

    BizLogic.Movement.create('Maintenance In', equipmentName, q, branch, 'Maintenance Lab', mt.id);
    BizLogic.Activity.log('Started ' + mt.type + ' maintenance for ' + q + 'x ' + equipmentName, 'warning');

    return { success: true, maintenance: mt };
  },

  complete: function(maintenanceId, resolutionNotes) {
    if (!MockData.maintenance) return { success: false, error: 'No maintenance records' };
    var mt = MockData.maintenance.find(function(m) { return m.id === maintenanceId; });
    if (!mt) return { success: false, error: 'Maintenance record not found' };
    if (mt.status === 'Completed') return { success: false, error: 'Already completed' };

    mt.status = 'Completed';
    mt.completionDate = new Date().toISOString().split('T')[0];
    mt.resolution = resolutionNotes || 'Maintenance completed successfully';

    // Move back to available stock
    var stock = BizLogic.Stock.find(mt.equipment, mt.branch);
    if (stock && stock.maintenance >= mt.quantity) {
      stock.maintenance -= mt.quantity;
      BizLogic.Stock.stockIn(mt.equipment, mt.branch, mt.quantity);
    }

    MockData.save('maintenance');

    BizLogic.Movement.create('Maintenance Out', mt.equipment, mt.quantity, 'Maintenance Lab', mt.branch, mt.id);
    BizLogic.Activity.log('Completed maintenance for ' + mt.equipment, 'success');

    return { success: true };
  }
};
